import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function InterviewMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInterview();
    initializeSpeechRecognition();
  }, [id]);

  const fetchInterview = async () => {
    try {
      const response = await axios.get(`/api/interviews/${id}`);
      setInterview(response.data);
      
      // Initialize answers object
      const initialAnswers = {};
      response.data.questions.forEach((_, index) => {
        initialAnswers[index] = response.data.questions[index].answer || '';
      });
      setAnswers(initialAnswers);
      setCurrentAnswer(initialAnswers[0] || '');
    } catch (error) {
      console.error('Error fetching interview:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setCurrentAnswer(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or another supported browser.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleAnswerChange = (e) => {
    setCurrentAnswer(e.target.value);
  };

  const saveCurrentAnswer = () => {
    setAnswers({
      ...answers,
      [currentQuestion]: currentAnswer
    });
  };

  const goToNext = () => {
    saveCurrentAnswer();
    if (currentQuestion < interview.questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setCurrentAnswer(answers[nextIndex] || '');
    }
  };

  const goToPrevious = () => {
    saveCurrentAnswer();
    if (currentQuestion > 0) {
      const prevIndex = currentQuestion - 1;
      setCurrentQuestion(prevIndex);
      setCurrentAnswer(answers[prevIndex] || '');
    }
  };

  const submitInterview = async () => {
    saveCurrentAnswer();
    setSubmitting(true);

    try {
      const finalAnswers = Object.values({
        ...answers,
        [currentQuestion]: currentAnswer
      });

      await axios.post(`/api/interviews/${id}/submit`, {
        answers: finalAnswers
      });

      navigate(`/feedback/${id}`);
    } catch (error) {
      console.error('Error submitting interview:', error);
      alert('Failed to submit interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!interview) {
    return <div>Interview not found</div>;
  }

  const progress = ((currentQuestion + 1) / interview.questions.length) * 100;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <h1>Interview in Progress</h1>
        <p>{interview.role} - {interview.questions.length} Questions</p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      
      <p style={{ textAlign: 'center', margin: '10px 0', color: '#666' }}>
        Question {currentQuestion + 1} of {interview.questions.length}
      </p>

      <div className="question-container">
        <div className="question-header">
          <div className="question-number">{currentQuestion + 1}</div>
        </div>
        
        <div className="question-text">
          {interview.questions[currentQuestion].question}
        </div>

        <div className="answer-section">
          <div className="voice-controls">
            <button
              onClick={toggleRecording}
              className={`voice-btn ${isRecording ? 'recording' : 'not-recording'}`}
            >
              {isRecording ? (
                <>
                  🛑 Stop Recording
                </>
              ) : (
                <>
                  🎤 Start Recording
                </>
              )}
            </button>
            
            {isRecording && (
              <div className="recording-indicator">
                <div className="recording-dot"></div>
                Recording...
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Your Answer:</label>
            <textarea
              className="form-control"
              rows="6"
              value={currentAnswer}
              onChange={handleAnswerChange}
              placeholder="Type your answer here or use the voice recording feature above..."
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
        <button
          onClick={goToPrevious}
          className="btn btn-secondary"
          disabled={currentQuestion === 0}
        >
          ← Previous
        </button>

        <div style={{ display: 'flex', gap: '15px' }}>
          {currentQuestion === interview.questions.length - 1 ? (
            <button
              onClick={submitInterview}
              className="btn btn-success"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : '✅ Submit Interview'}
            </button>
          ) : (
            <button
              onClick={goToNext}
              className="btn btn-primary"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px', background: '#f8f9fa' }}>
        <div className="card-body">
          <h4>💡 Tips for better answers:</h4>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li>Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
            <li>Be specific and provide concrete examples</li>
            <li>Speak clearly if using voice recording</li>
            <li>Take your time to think before answering</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InterviewMode;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function InterviewFeedback() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    try {
      const response = await axios.get(`/api/interviews/${id}`);
      setInterview(response.data);
    } catch (error) {
      console.error('Error fetching interview feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#28a745';
    if (score >= 6) return '#17a2b8';
    if (score >= 4) return '#ffc107';
    return '#dc3545';
  };

  const getScoreClass = (score) => {
    if (score >= 8) return 'score-excellent';
    if (score >= 6) return 'score-good';
    if (score >= 4) return 'score-fair';
    return 'score-poor';
  };

  const getOverallGrade = (totalScore) => {
    const percentage = (totalScore / 100) * 100;
    if (percentage >= 80) return { grade: 'A', label: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', label: 'Good' };
    if (percentage >= 60) return { grade: 'C', label: 'Average' };
    if (percentage >= 50) return { grade: 'D', label: 'Below Average' };
    return { grade: 'F', label: 'Needs Improvement' };
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!interview || !interview.completed) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Interview not completed yet</h2>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  const overallGrade = getOverallGrade(interview.totalScore);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <h1>Interview Feedback</h1>
        <p>{interview.role} - Completed on {new Date(interview.updatedAt).toLocaleDateString()}</p>
      </div>

      {/* Overall Score Card */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <div className="card-body" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>Overall Performance</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
            <div>
              <div className="score-circle" style={{ 
                background: getScoreColor(interview.totalScore / 10),
                width: '100px',
                height: '100px',
                fontSize: '2rem'
              }}>
                {interview.totalScore}
              </div>
              <p style={{ marginTop: '10px', fontWeight: '600' }}>Total Score</p>
            </div>
            <div>
              <div className="score-circle" style={{ 
                background: getScoreColor(interview.totalScore / 10),
                width: '100px',
                height: '100px',
                fontSize: '2.5rem'
              }}>
                {overallGrade.grade}
              </div>
              <p style={{ marginTop: '10px', fontWeight: '600' }}>{overallGrade.label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Question-by-Question Feedback */}
      <div className="section-header">
        <h2>Detailed Feedback</h2>
        <p>Review each question and improve your answers</p>
      </div>

      {interview.questions.map((q, index) => (
        <div key={index} className="card" style={{ marginBottom: '30px' }}>
          <div className="card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Question {index + 1}</h3>
              <span className={`score-badge ${getScoreClass(q.score)}`}>
                {q.score}/10
              </span>
            </div>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#007bff', marginBottom: '10px' }}>Question:</h4>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{q.question}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#28a745', marginBottom: '10px' }}>Your Answer:</h4>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <p style={{ margin: 0, lineHeight: '1.6' }}>
                  {q.answer || <em>No answer provided</em>}
                </p>
              </div>
            </div>

            <div className="feedback-section">
              <h4 style={{ color: '#dc3545', marginBottom: '15px' }}>AI Feedback & Suggestions:</h4>
              <div className="feedback-score">
                <div 
                  className="score-circle" 
                  style={{ 
                    background: getScoreColor(q.score),
                    width: '50px',
                    height: '50px',
                    fontSize: '1.2rem'
                  }}
                >
                  {q.score}
                </div>
                <div>
                  <p style={{ margin: 0, lineHeight: '1.6' }}>{q.feedback}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/new-interview" className="btn btn-primary">
            🚀 Start New Interview
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            📊 Back to Dashboard
          </Link>
          <Link to="/past-interviews" className="btn btn-secondary">
            📋 View All Interviews
          </Link>
        </div>
      </div>

      {/* Improvement Tips */}
      <div className="card" style={{ marginTop: '40px', background: '#f8f9fa' }}>
        <div className="card-body">
          <h3 style={{ marginBottom: '20px' }}>💡 General Tips for Improvement:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <h4>📚 Preparation Tips:</h4>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Research the company and role thoroughly</li>
                <li>Practice common interview questions</li>
                <li>Prepare specific examples using STAR method</li>
                <li>Review job requirements and align your experience</li>
              </ul>
            </div>
            <div>
              <h4>🗣️ Communication Tips:</h4>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Be concise and structured in your answers</li>
                <li>Use specific examples and quantify achievements</li>
                <li>Show enthusiasm and ask thoughtful questions</li>
                <li>Practice active listening and engagement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewFeedback;
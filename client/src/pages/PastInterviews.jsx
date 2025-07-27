import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PastInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'incomplete'

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await axios.get('/api/interviews/my-interviews');
      setInterviews(response.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
  };

  const filteredInterviews = interviews.filter(interview => {
    if (filter === 'completed') return interview.completed;
    if (filter === 'incomplete') return !interview.completed;
    return true;
  });

  const completedInterviews = interviews.filter(interview => interview.completed);
  const totalScore = completedInterviews.reduce((sum, interview) => sum + interview.totalScore, 0);
  const averageScore = completedInterviews.length > 0 ? Math.round(totalScore / completedInterviews.length) : 0;

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <h1>Interview History</h1>
        <p>Track your progress and review past performances</p>
      </div>

      {/* Statistics */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="stats-card">
          <div className="stats-number">{interviews.length}</div>
          <div className="stats-label">Total Interviews</div>
        </div>
        <div className="stats-card">
          <div className="stats-number">{completedInterviews.length}</div>
          <div className="stats-label">Completed</div>
        </div>
        <div className="stats-card">
          <div className="stats-number">{averageScore}</div>
          <div className="stats-label">Average Score</div>
        </div>
        <div className="stats-card">
          <div className="stats-number">{interviews.length - completedInterviews.length}</div>
          <div className="stats-label">In Progress</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ margin: '30px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: '10px', background: '#f8f9fa', padding: '5px', borderRadius: '25px' }}>
          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px' }}
          >
            All ({interviews.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px' }}
          >
            Completed ({completedInterviews.length})
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`btn ${filter === 'incomplete' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px' }}
          >
            In Progress ({interviews.length - completedInterviews.length})
          </button>
        </div>
      </div>

      {/* Interviews List */}
      {filteredInterviews.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3>No interviews found</h3>
            <p>
              {filter === 'all' && "You haven't created any interviews yet."}
              {filter === 'completed' && "You haven't completed any interviews yet."}
              {filter === 'incomplete' && "You don't have any interviews in progress."}
            </p>
            <Link to="/new-interview" className="btn btn-primary">
              Start New Interview
            </Link>
          </div>
        </div>
      ) : (
        <div className="dashboard-grid">
          {filteredInterviews.map((interview) => (
            <div key={interview._id} className="card interview-card">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0 }}>{interview.role}</h3>
                  {interview.completed && (
                    <span className={`score-badge ${getScoreClass(interview.totalScore)}`}>
                      {interview.totalScore}/100
                    </span>
                  )}
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <p><strong>Experience:</strong> {interview.experience} years</p>
                  <p><strong>Created:</strong> {new Date(interview.createdAt).toLocaleDateString()}</p>
                  {interview.completed && (
                    <p><strong>Completed:</strong> {new Date(interview.updatedAt).toLocaleDateString()}</p>
                  )}
                  <p><strong>Questions:</strong> {interview.questions.length}</p>
                </div>

                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  marginBottom: '15px',
                  fontSize: '14px'
                }}>
                  <strong>Job Description:</strong>
                  <p style={{ margin: '5px 0 0 0' }}>
                    {interview.jobDescription.length > 100 
                      ? interview.jobDescription.substring(0, 100) + '...'
                      : interview.jobDescription
                    }
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {interview.completed ? (
                    <Link to={`/feedback/${interview._id}`} className="btn btn-primary">
                      View Feedback
                    </Link>
                  ) : (
                    <Link to={`/interview/${interview._id}`} className="btn btn-success">
                      Continue Interview
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back to Dashboard */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/dashboard" className="btn btn-secondary">
          📊 Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default PastInterviews;
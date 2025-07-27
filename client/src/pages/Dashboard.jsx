import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    averageScore: 0
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await axios.get('/api/interviews/my-interviews');
      setInterviews(response.data);
      
      // Calculate stats
      const completed = response.data.filter(interview => interview.completed);
      const totalScore = completed.reduce((sum, interview) => sum + interview.totalScore, 0);
      const averageScore = completed.length > 0 ? Math.round(totalScore / completed.length) : 0;
      
      setStats({
        total: response.data.length,
        completed: completed.length,
        averageScore
      });
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

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <p>Track your progress and continue improving your interview skills</p>
      </div>

      <div className="dashboard-grid">
        <div className="stats-card">
          <div className="stats-number">{stats.total}</div>
          <div className="stats-label">Total Interviews</div>
        </div>
        <div className="stats-card">
          <div className="stats-number">{stats.completed}</div>
          <div className="stats-label">Completed</div>
        </div>
        <div className="stats-card">
          <div className="stats-number">{stats.averageScore}</div>
          <div className="stats-label">Average Score</div>
        </div>
      </div>

      <div style={{ margin: '40px 0', textAlign: 'center' }}>
        <Link to="/new-interview" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
          🚀 Start New Interview
        </Link>
      </div>

      <div className="section-header">
        <h2>Recent Interviews</h2>
        <p>Your latest interview attempts and results</p>
      </div>

      {interviews.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3>No interviews yet</h3>
            <p>Start your first mock interview to begin improving your skills!</p>
            <Link to="/new-interview" className="btn btn-primary">
              Create Your First Interview
            </Link>
          </div>
        </div>
      ) : (
        <div className="dashboard-grid">
          {interviews.slice(0, 6).map((interview) => (
            <div key={interview._id} className="card interview-card">
              <div className="card-body">
                <h3>{interview.role}</h3>
                <p><strong>Experience:</strong> {interview.experience} years</p>
                <p><strong>Date:</strong> {new Date(interview.createdAt).toLocaleDateString()}</p>
                {interview.completed && (
                  <div style={{ margin: '15px 0' }}>
                    <span className={`score-badge ${getScoreClass(interview.totalScore)}`}>
                      Score: {interview.totalScore}/100
                    </span>
                  </div>
                )}
                <div style={{ marginTop: '20px' }}>
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

      {interviews.length > 6 && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/past-interviews" className="btn btn-secondary">
            View All Interviews
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
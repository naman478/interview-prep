import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NewInterview() {
  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    jobDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/interviews/create', {
        ...formData,
        experience: parseInt(formData.experience)
      });
      navigate(`/interview/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-header">
        <h1>Start New Interview</h1>
        <p>Fill in your details to get personalized interview questions</p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card">
          <div className="card-body">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Target Role *</label>
                <input
                  type="text"
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Frontend Developer, Data Scientist, Product Manager"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Years of Experience *</label>
                <select
                  name="experience"
                  className="form-control"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select experience level</option>
                  <option value="0">0 - Fresh Graduate</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5 years</option>
                  <option value="6">6-10 years</option>
                  <option value="10">10+ years</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Job Description / Requirements *</label>
                <textarea
                  name="jobDescription"
                  className="form-control"
                  rows="6"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  required
                  placeholder="Paste the job description or key requirements/skills for the role..."
                  style={{ resize: 'vertical' }}
                />
                <small style={{ color: '#666', fontSize: '14px' }}>
                  Tip: Include key technologies, skills, and responsibilities to get more relevant questions
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '15px' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span>Generating Questions...</span>
                    <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                      <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                    </div>
                  </>
                ) : (
                  '🚀 Generate Interview Questions'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="card" style={{ marginTop: '30px', background: '#f8f9fa' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '15px' }}>What to expect:</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>10 personalized questions based on your role and experience</li>
              <li>Mix of technical and behavioral questions</li>
              <li>Voice recording or text input options</li>
              <li>Detailed AI feedback for each answer</li>
              <li>Overall score and improvement suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewInterview;
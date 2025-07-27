import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Master Your Next Interview</h1>
          <p>
            Practice with AI-powered mock interviews tailored to your role and experience. 
            Get instant feedback and improve your interview skills.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '15px 30px' }}>
            Start Practicing Now
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Four simple steps to improve your interview performance</p>
          </div>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">📝</div>
              <h3>1. Fill Your Details</h3>
              <p>Enter your target role, years of experience, and job description to get personalized questions.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">❓</div>
              <h3>2. Get AI Questions</h3>
              <p>Our AI generates 10 relevant interview questions based on your profile and the role requirements.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎤</div>
              <h3>3. Answer Via Voice/Text</h3>
              <p>Respond to questions using your microphone or by typing. Practice as if it's a real interview.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📊</div>
              <h3>4. Get Detailed Feedback</h3>
              <p>Receive scores and improvement suggestions for each answer to enhance your performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Mock Interview Pro?</h2>
            <p>Advanced features to help you succeed</p>
          </div>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Questions</h3>
              <p>Questions generated specifically for your role and experience level using advanced AI technology.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Feedback</h3>
              <p>Get detailed feedback on each answer with specific suggestions for improvement.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📈</div>
              <h3>Track Progress</h3>
              <p>Monitor your improvement over time with detailed analytics and performance history.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎙️</div>
              <h3>Voice Practice</h3>
              <p>Practice speaking your answers aloud to simulate real interview conditions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero" style={{ padding: '60px 0' }}>
        <div className="container">
          <h2>Ready to Ace Your Next Interview?</h2>
          <p>Join thousands of professionals who have improved their interview skills</p>
          <div style={{ marginTop: '30px' }}>
            <Link to="/register" className="btn btn-primary" style={{ marginRight: '15px' }}>
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
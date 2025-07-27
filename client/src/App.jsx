import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewInterview from './pages/NewInterview';
import InterviewMode from './pages/InterviewMode';
import InterviewFeedback from './pages/InterviewFeedback';
import PastInterviews from './pages/PastInterviews';
import { AuthProvider, useAuth } from './context/AuthContext';

// Set up axios defaults
axios.defaults.baseURL = 'https://interview-prep-cytc.onrender.com' || 'http://localhost:5000';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/new-interview" element={<PrivateRoute><NewInterview /></PrivateRoute>} />
            <Route path="/interview/:id" element={<PrivateRoute><InterviewMode /></PrivateRoute>} />
            <Route path="/feedback/:id" element={<PrivateRoute><InterviewFeedback /></PrivateRoute>} />
            <Route path="/past-interviews" element={<PrivateRoute><PastInterviews /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
}

export default App;
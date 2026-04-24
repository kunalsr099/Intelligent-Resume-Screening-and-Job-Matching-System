import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import JobList from './pages/JobList';
import JobCreate from './pages/JobCreate';
import JobMatches from './pages/JobMatches';
import ResumeList from './pages/ResumeList';
import './App.css';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/resumes" element={<PrivateRoute><ResumeList /></PrivateRoute>} />
              <Route path="/resumes/upload" element={<PrivateRoute><ResumeUpload /></PrivateRoute>} />
              <Route path="/jobs" element={<PrivateRoute><JobList /></PrivateRoute>} />
              <Route path="/jobs/create" element={<PrivateRoute><JobCreate /></PrivateRoute>} />
              <Route path="/jobs/:jobId/matches" element={<PrivateRoute><JobMatches /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;

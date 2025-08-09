import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { WebsiteDetails } from './pages/WebsiteDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/website/:id" element={<WebsiteDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
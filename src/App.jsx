import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const userData = localStorage.getItem('user');
  
  if (!token || !userData) {
    // Clear any potentially invalid data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    return <Navigate to="/login" replace />;
  }

  // Check if the user is trying to access the correct dashboard
  const path = window.location.pathname;
  if (userType === 'doctor' && !path.includes('doctor-dashboard')) {
    return <Navigate to="/doctor-dashboard" replace />;
  }
  if (userType === 'patient' && !path.includes('patient-dashboard')) {
    return <Navigate to="/patient-dashboard" replace />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  
  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType');
      const userData = localStorage.getItem('user');
      
      if (token && userData && storedUserType) {
        setIsAuthenticated(true);
        setUserType(storedUserType);
      } else {
        // Clear any invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        setIsAuthenticated(false);
        setUserType(null);
      }
    };

    checkAuth();
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);
  
  return (
    <Router>
      <Routes>
        {/* Make login the default route */}
        <Route path="/" element={
          isAuthenticated ? (
            <Navigate to={`/${userType}-dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to={`/${userType}-dashboard`} replace />
          ) : (
            <Login />
          )
        } />
        <Route path="/register" element={
          isAuthenticated ? (
            <Navigate to={`/${userType}-dashboard`} replace />
          ) : (
            <Register />
          )
        } />
        <Route path="/forgot-password" element={
          isAuthenticated ? (
            <Navigate to={`/${userType}-dashboard`} replace />
          ) : (
            <ForgotPassword />
          )
        } />
        
        {/* Protected Dashboard Routes */}
        <Route
          path="/doctor-dashboard/*"
          element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/patient-dashboard/*"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* NotFound Route - redirects to login if not authenticated */}
        <Route path="*" element={
          isAuthenticated ? (
            <NotFound />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
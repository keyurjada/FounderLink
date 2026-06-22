import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { SessionContext } from '../context/SessionProvider.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useContext(SessionContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#080d0b', color: '#f8fafc' }}>
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

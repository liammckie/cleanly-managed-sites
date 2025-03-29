
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// This is a simple implementation - you'll need to enhance this with actual auth logic
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // For now, assume user is authenticated - you should implement actual auth check
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

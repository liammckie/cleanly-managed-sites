
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Sites from '@/pages/Sites';
import Clients from '@/pages/Clients';
import CreateSite from '@/pages/CreateSite';
import EditSite from '@/pages/EditSite';
import SiteDetail from '@/pages/SiteDetail';
import WorkOrders from '@/pages/WorkOrders';
import Settings from '@/pages/Settings';
import Integrations from '@/pages/Integrations';
import Contracts from '@/pages/Contracts';
import NotFound from '@/pages/NotFound';
import ResetPassword from '@/pages/ResetPassword';
import Index from '@/pages/Index';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/hooks/auth/AuthProvider';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/sites" element={
              <ProtectedRoute>
                <Sites />
              </ProtectedRoute>
            } />
            
            <Route path="/sites/create" element={
              <ProtectedRoute>
                <CreateSite />
              </ProtectedRoute>
            } />
            
            <Route path="/sites/:id" element={
              <ProtectedRoute>
                <SiteDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/sites/:id/edit" element={
              <ProtectedRoute>
                <EditSite />
              </ProtectedRoute>
            } />

            <Route path="/contracts" element={
              <ProtectedRoute>
                <Contracts />
              </ProtectedRoute>
            } />
            
            <Route path="/clients" element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            } />
            
            <Route path="/workorders" element={
              <ProtectedRoute>
                <WorkOrders />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            <Route path="/integrations" element={
              <ProtectedRoute>
                <Integrations />
              </ProtectedRoute>
            } />
            
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

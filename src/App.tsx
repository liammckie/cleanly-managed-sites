import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Sites from '@/pages/Sites';
import Clients from '@/pages/Clients';
import Contractors from '@/pages/Contractors';
import CreateClient from '@/pages/CreateClient';
import EditClient from '@/pages/EditClient';
import CreateSite from '@/pages/CreateSite';
import EditSite from '@/pages/EditSite';
import SiteDetail from '@/pages/SiteDetail';
import ClientDetail from '@/pages/ClientDetail';
import WorkOrders from '@/pages/WorkOrders';
import Settings from '@/pages/Settings';
import Integrations from '@/pages/Integrations';
import Contracts from '@/pages/Contracts';
import ImportExport from '@/pages/ImportExport';
import NotFound from '@/pages/NotFound';
import ResetPassword from '@/pages/ResetPassword';
import Index from '@/pages/Index';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/hooks/auth/AuthProvider';
import CreateContractor from '@/pages/CreateContractor';
import ContractorDetail from '@/pages/ContractorDetail';
import Users from '@/pages/Users';
import UserDetail from '@/pages/UserDetail';
import './App.css';

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
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              <Route path="/clients/create" element={
                <ProtectedRoute>
                  <CreateClient />
                </ProtectedRoute>
              } />
              <Route path="/clients/:id/edit" element={
                <ProtectedRoute>
                  <EditClient />
                </ProtectedRoute>
              } />
              <Route path="/clients/:id" element={
                <ProtectedRoute>
                  <ClientDetail />
                </ProtectedRoute>
              } />
              
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
              
              <Route path="/contractors" element={
                <ProtectedRoute>
                  <Contractors />
                </ProtectedRoute>
              } />
              
              <Route path="/contractors/create" element={
                <ProtectedRoute>
                  <CreateContractor />
                </ProtectedRoute>
              } />
              
              <Route path="/contractors/:id" element={
                <ProtectedRoute>
                  <ContractorDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/workorders" element={
                <ProtectedRoute>
                  <WorkOrders />
                </ProtectedRoute>
              } />
              
              <Route path="/import-export" element={
                <ProtectedRoute>
                  <ImportExport />
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
              
              <Route path="/users" element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              } />
              
              <Route path="/users/:id" element={
                <ProtectedRoute>
                  <UserDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;

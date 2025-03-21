
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sites from './pages/Sites';
import Clients from './pages/Clients';
import CreateSite from './pages/CreateSite';
import EditSite from './pages/EditSite';
import SiteDetail from './pages/SiteDetail';
import ClientDetail from './pages/ClientDetail';
import CreateClient from './pages/CreateClient';
import EditClient from './pages/EditClient';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';
import Integrations from './pages/Integrations';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/auth';

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/clients/create" element={<ProtectedRoute><CreateClient /></ProtectedRoute>} />
            <Route path="/clients/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
            <Route path="/clients/:id/edit" element={<ProtectedRoute><EditClient /></ProtectedRoute>} />
            <Route path="/sites" element={<ProtectedRoute><Sites /></ProtectedRoute>} />
            <Route path="/sites/create" element={<ProtectedRoute><CreateSite /></ProtectedRoute>} />
            <Route path="/sites/:id" element={<ProtectedRoute><SiteDetail /></ProtectedRoute>} />
            <Route path="/sites/:id/edit" element={<ProtectedRoute><EditSite /></ProtectedRoute>} />
            <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster position="top-right" />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App

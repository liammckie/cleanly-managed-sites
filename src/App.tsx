
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sites from './pages/Sites';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import WorkOrders from './pages/WorkOrders';
import Subcontractors from './pages/Subcontractors';
import Login from './pages/Login';
import { AuthProvider } from './hooks/auth';
import ProtectedRoute from './components/ProtectedRoute';
import SiteDetails from './pages/SiteDetails';
import ClientDetails from './pages/ClientDetails';
import CreateSite from './pages/CreateSite';
import EditSite from './pages/EditSite';
import CreateClient from './pages/CreateClient';
import EditClient from './pages/EditClient';
import QuotingTool from './pages/QuotingTool';
import QuoteDetails from './pages/QuoteDetails';
import CreateQuote from './pages/CreateQuote';
import EditQuote from './pages/EditQuote';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
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
      <Route path="/sites/:siteId" element={
        <ProtectedRoute>
          <SiteDetails />
        </ProtectedRoute>
      } />
      <Route path="/sites/create" element={
        <ProtectedRoute>
          <CreateSite />
        </ProtectedRoute>
      } />
       <Route path="/sites/edit/:siteId" element={
        <ProtectedRoute>
          <EditSite />
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute>
          <Clients />
        </ProtectedRoute>
      } />
       <Route path="/clients/:clientId" element={
        <ProtectedRoute>
          <ClientDetails />
        </ProtectedRoute>
      } />
      <Route path="/clients/create" element={
        <ProtectedRoute>
          <CreateClient />
        </ProtectedRoute>
      } />
      <Route path="/clients/edit/:clientId" element={
        <ProtectedRoute>
          <EditClient />
        </ProtectedRoute>
      } />
      <Route path="/workorders/:siteId" element={
        <ProtectedRoute>
          <WorkOrders />
        </ProtectedRoute>
      } />
      <Route path="/subcontractors/:siteId" element={
        <ProtectedRoute>
          <Subcontractors />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/quoting" element={
        <ProtectedRoute>
          <QuotingTool />
        </ProtectedRoute>
      } />
      <Route path="/quoting/create" element={
        <ProtectedRoute>
          <CreateQuote />
        </ProtectedRoute>
      } />
      <Route path="/quoting/:quoteId" element={
        <ProtectedRoute>
          <QuoteDetails />
        </ProtectedRoute>
      } />
      <Route path="/quoting/edit/:quoteId" element={
        <ProtectedRoute>
          <EditQuote />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;

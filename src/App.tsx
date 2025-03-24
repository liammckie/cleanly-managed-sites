
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Sites from './pages/Sites';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import SiteDetail from './pages/SiteDetail';
import SiteEdit from './pages/SiteEdit';
import CreateSite from './pages/CreateSite'; // Use consistent naming
import ClientDetail from './pages/ClientDetail';
import ClientEdit from './pages/ClientEdit';
import ClientCreate from './pages/ClientCreate';
import WorkOrders from './pages/WorkOrders';
import Contractors from './pages/Contractors';
import Subcontractors from './pages/Subcontractors';
import Contacts from './pages/Contacts';
import Users from './pages/Users';
import WorkOrderDetail from './pages/WorkOrderDetail';
import ContractorDetail from './pages/ContractorDetail';
import ContactDetail from './pages/ContactDetail';
import { ContractVariationPage } from './components/sites/contract/variation/ContractVariationPage';
import { ErrorPage } from './pages/ErrorPage';
import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';

// Create the query client outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="project-ui-theme">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/sites" element={<ProtectedRoute><Sites /></ProtectedRoute>} />
            <Route path="/sites/:siteId" element={<ProtectedRoute><SiteDetail /></ProtectedRoute>} />
            <Route path="/sites/:siteId/edit" element={<ProtectedRoute><SiteEdit /></ProtectedRoute>} />
            <Route path="/sites/create" element={<ProtectedRoute><CreateSite /></ProtectedRoute>} /> 
            <Route path="/sites/:siteId/variations" element={<ProtectedRoute><ContractVariationPage /></ProtectedRoute>} />
            <Route path="/sites/:siteId/variations/:variationType" element={<ProtectedRoute><ContractVariationPage /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
            <Route path="/clients/:clientId" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
            <Route path="/clients/:clientId/edit" element={<ProtectedRoute><ClientEdit /></ProtectedRoute>} />
            <Route path="/clients/create" element={<ProtectedRoute><ClientCreate /></ProtectedRoute>} />
            <Route path="/workorders" element={<ProtectedRoute><WorkOrders /></ProtectedRoute>} />
            <Route path="/workorders/:workOrderId" element={<ProtectedRoute><WorkOrderDetail /></ProtectedRoute>} />
            <Route path="/contractors" element={<ProtectedRoute><Contractors /></ProtectedRoute>} />
            <Route path="/contractors/:contractorId" element={<ProtectedRoute><ContractorDetail /></ProtectedRoute>} />
            <Route path="/subcontractors" element={<ProtectedRoute><Subcontractors /></ProtectedRoute>} />
            <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
            <Route path="/contacts/:contactId" element={<ProtectedRoute><ContactDetail /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;

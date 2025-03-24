
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Sites from './pages/Sites';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import SiteDetail from './pages/SiteDetail';
import SiteEdit from './pages/SiteEdit';
import SiteCreate from './pages/SiteCreate';
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/sites/:siteId" element={<SiteDetail />} />
            <Route path="/sites/:siteId/edit" element={<SiteEdit />} />
            <Route path="/sites/create" element={<SiteCreate />} />
            <Route path="/sites/:siteId/variations" element={<ContractVariationPage />} />
            <Route path="/sites/:siteId/variations/:variationType" element={<ContractVariationPage />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:clientId" element={<ClientDetail />} />
            <Route path="/clients/:clientId/edit" element={<ClientEdit />} />
            <Route path="/clients/create" element={<ClientCreate />} />
            <Route path="/workorders" element={<WorkOrders />} />
            <Route path="/workorders/:workOrderId" element={<WorkOrderDetail />} />
            <Route path="/contractors" element={<Contractors />} />
            <Route path="/contractors/:contractorId" element={<ContractorDetail />} />
            <Route path="/subcontractors" element={<Subcontractors />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:contactId" element={<ContactDetail />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;

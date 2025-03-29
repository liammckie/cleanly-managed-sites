
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Sites from './pages/Sites';
import Contractors from './pages/Contractors';
import Employees from './pages/Employees';
import Users from './pages/Users';
import UserRoles from './pages/UserRoles';
import Quotes from './pages/Quotes';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Help from './pages/Help';
import Settings from './pages/Settings';
import Subcontractors from './pages/Subcontractors';
import CreateClient from './pages/CreateClient';
import EditClient from './pages/EditClient';
import CreateSite from './pages/CreateSite';
import EditSite from './pages/EditSite';
import CreateContractor from './pages/CreateContractor';
import EditContractor from './pages/EditContractor';
import Profile from './pages/Profile';
import ErrorPage from './pages/ErrorPage';
import QuoteDetail from './pages/QuoteDetail';
import WorkOrderDetails from './pages/WorkOrderDetails';
import Contacts from './pages/Contacts';
import NotFound from './pages/NotFound';
import UserRoleEdit from './pages/UserRoleEdit';
import UserRoleCreate from './pages/UserRoleCreate';
import { ContractVariationPage } from './components/sites/contract/variation/ContractVariationPage';

const App = () => {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/create" element={<CreateClient />} />
        <Route path="/clients/:id" element={<EditClient />} />
        <Route path="/sites" element={<Sites />} />
        <Route path="/sites/create" element={<CreateSite />} />
        <Route path="/sites/:id" element={<EditSite />} />
        <Route path="/contractors" element={<Contractors />} />
        <Route path="/contractors/create" element={<CreateContractor />} />
        <Route path="/contractors/:id" element={<EditContractor />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/users" element={<Users />} />
        <Route path="/user-roles" element={<UserRoles />} />
        <Route path="/user-roles/new" element={<UserRoleCreate />} />
        <Route path="/user-roles/:id" element={<UserRoleEdit />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/quotes/:id" element={<QuoteDetail />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/subcontractors" element={<Subcontractors />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/work-orders/:id" element={<WorkOrderDetails />} />
        <Route path="/contacts" element={<Contacts />} />
        
        {/* Contract variation routes */}
        <Route path="/sites/:siteId/contract-variations" element={<ContractVariationPage />} />
        <Route path="/sites/:siteId/contract-variations/:variationType" element={<ContractVariationPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HelmetProvider>
  );
};

export default App;

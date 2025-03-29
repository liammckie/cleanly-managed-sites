import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/error-boundary/ErrorBoundary';

// Page Imports
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import Loader from '@/components/ui/loader/Loader';

// Lazy-loaded page components
const Clients = lazy(() => import('@/pages/Clients'));
const ClientDetail = lazy(() => import('@/pages/ClientDetail'));
const Sites = lazy(() => import('@/pages/Sites'));
const SiteDetail = lazy(() => import('@/pages/SiteDetail'));
const CreateSite = lazy(() => import('@/pages/CreateSite'));
const EditSite = lazy(() => import('@/pages/EditSite'));
const Users = lazy(() => import('@/pages/Users'));
const Contractors = lazy(() => import('@/pages/Contractors'));
const ContractorDetail = lazy(() => import('@/pages/ContractorDetail'));
const CreateContractor = lazy(() => import('@/pages/CreateContractor'));
const EditContractor = lazy(() => import('@/pages/EditContractor'));
const Quotes = lazy(() => import('@/pages/Quotes'));
const CreateQuote = lazy(() => import('@/pages/CreateQuote'));
const EditQuote = lazy(() => import('@/pages/EditQuote'));
const QuoteDetail = lazy(() => import('@/pages/QuoteDetail'));
const Reports = lazy(() => import('@/pages/Reports'));
const Settings = lazy(() => import('@/pages/Settings'));
const Help = lazy(() => import('@/pages/Help'));
const Invoices = lazy(() => import('@/pages/Invoices'));
const WorkOrders = lazy(() => import('@/pages/WorkOrders'));
const WorkOrderDetails = lazy(() => import('@/pages/WorkOrderDetails'));

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      {/* Client Routes */}
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <Clients />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:clientId"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <ClientDetail />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      {/* Site Routes */}
      <Route
        path="/sites"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <Sites />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sites/create"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <CreateSite />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sites/:siteId"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <SiteDetail />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sites/:siteId/edit"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <EditSite />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      {/* Quote Routes */}
      <Route
        path="/quotes"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <Quotes />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotes/create"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <CreateQuote />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotes/:quoteId"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <QuoteDetail />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotes/:quoteId/edit"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <EditQuote />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      {/* Other pages would be similar structure */}
      <Route
        path="/quote-details/:quoteId"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <QuoteDetail />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <Users />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contractors"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <Contractors />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contractors/create"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <CreateContractor />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contractors/:contractorId"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <ContractorDetail />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contractors/:contractorId/edit"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <EditContractor />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <Reports />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <Settings />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <Help />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <Invoices />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/work-orders"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <WorkOrders />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/work-orders/:workOrderId"
        element={
          <ProtectedRoute>
            <PageLayout>
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <WorkOrderDetails />
                </Suspense>
              </ErrorBoundary>
            </PageLayout>
          </ProtectedRoute>
        }
      />

      {/* Default and 404 routes */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;

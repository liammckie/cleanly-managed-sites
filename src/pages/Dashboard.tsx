
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { useSites } from '@/hooks/useSites';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardActions } from '@/components/dashboard/DashboardActions';
import { BusinessOverview } from '@/components/dashboard/BusinessOverview';
import { ErrorBoundary } from '@/components/ui/error-boundary/ErrorBoundary';

const Dashboard = () => {
  const { sites } = useSites();
  
  return (
    <PageLayout>
      <div className="p-6 animate-fade-in">
        <ErrorBoundary>
          <DashboardHeader />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <DashboardActions />
        </ErrorBoundary>
        
        <div className="space-y-8 mt-6">
          <ErrorBoundary>
            <DashboardMetrics />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <BusinessOverview />
          </ErrorBoundary>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;

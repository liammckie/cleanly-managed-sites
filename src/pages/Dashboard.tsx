
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { useSites } from '@/hooks/useSites';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { QuickActions } from '@/components/dashboard/QuickActions';
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
        
        <div className="space-y-8">
          <ErrorBoundary>
            <DashboardMetrics />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <QuickActions sites={sites} />
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

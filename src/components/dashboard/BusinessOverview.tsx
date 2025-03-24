
import React from 'react';
import { ClientDashboard } from '@/components/clients/ClientDashboard';
import { ContractorsDashboard } from '@/components/contractors/ContractorsDashboard';

export function BusinessOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ClientDashboard />
      <ContractorsDashboard />
    </div>
  );
}

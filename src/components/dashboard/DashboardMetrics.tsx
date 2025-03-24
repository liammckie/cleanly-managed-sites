
import React from 'react';
import { ContractValueMetrics } from '@/components/contracts/ContractValueMetrics';
import { WorkOrderMetrics } from '@/components/workorders/WorkOrderMetrics';

export function DashboardMetrics() {
  return (
    <div className="space-y-8">
      <ContractValueMetrics />
      <WorkOrderMetrics />
    </div>
  );
}

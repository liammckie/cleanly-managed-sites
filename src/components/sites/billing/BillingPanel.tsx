
import React from 'react';

interface BillingPanelProps {
  site: any;
  refetchSite: () => void;
}

export default function BillingPanel({ site, refetchSite }: BillingPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Billing</h3>
      <div className="text-sm text-gray-500">
        Billing panel component - to be implemented
      </div>
    </div>
  );
}

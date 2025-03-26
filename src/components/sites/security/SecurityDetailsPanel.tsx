
import React from 'react';

interface SecurityDetailsPanelProps {
  site: any;
  refetchSite: () => void;
}

export default function SecurityDetailsPanel({ site, refetchSite }: SecurityDetailsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Security Details</h3>
      <div className="text-sm text-gray-500">
        Security details component - to be implemented
      </div>
    </div>
  );
}


import React from 'react';

interface JobSpecificationsPanelProps {
  site: any;
  refetchSite: () => void;
}

export default function JobSpecificationsPanel({ site, refetchSite }: JobSpecificationsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Job Specifications</h3>
      <div className="text-sm text-gray-500">
        Job specifications component - to be implemented
      </div>
    </div>
  );
}

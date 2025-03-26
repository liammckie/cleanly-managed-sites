
import React from 'react';

interface ContractDetailsProps {
  site: any;
  refetchSite: () => void;
}

export default function ContractDetails({ site, refetchSite }: ContractDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Contract Details</h3>
      <div className="text-sm text-gray-500">
        Contract details component - to be implemented
      </div>
    </div>
  );
}

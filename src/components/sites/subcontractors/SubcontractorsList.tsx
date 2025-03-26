
import React from 'react';

interface SubcontractorsListProps {
  site: any;
  refetchSite: () => void;
}

export default function SubcontractorsList({ site, refetchSite }: SubcontractorsListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Subcontractors</h3>
      <div className="text-sm text-gray-500">
        Subcontractors list component - to be implemented
      </div>
    </div>
  );
}

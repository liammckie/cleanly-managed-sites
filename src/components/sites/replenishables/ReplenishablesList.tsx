
import React from 'react';

interface ReplenishablesListProps {
  site: any;
  refetchSite: () => void;
}

export default function ReplenishablesList({ site, refetchSite }: ReplenishablesListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Replenishables</h3>
      <div className="text-sm text-gray-500">
        Replenishables list component - to be implemented
      </div>
    </div>
  );
}

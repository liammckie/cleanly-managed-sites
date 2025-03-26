
import React from 'react';

interface WorkOrdersListProps {
  siteId: string;
}

export default function WorkOrdersList({ siteId }: WorkOrdersListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Work Orders</h3>
      <div className="text-sm text-gray-500">
        Work orders list component - to be implemented
      </div>
    </div>
  );
}

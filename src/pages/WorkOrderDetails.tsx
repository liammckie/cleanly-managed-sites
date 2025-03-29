
import React from 'react';
import { useParams } from 'react-router-dom';

const WorkOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Work Order Details</h1>
      <p className="text-gray-600">Details for work order ID: {id}</p>
    </div>
  );
}

export default WorkOrderDetails;


import React from 'react';
import { useParams } from 'react-router-dom';

const WorkOrderDetail = () => {
  const { workOrderId } = useParams();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Work Order Details</h1>
      <p>Work order {workOrderId} details page is being implemented.</p>
    </div>
  );
};

export default WorkOrderDetail;


import React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const WorkOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <Helmet>
        <title>Work Order Details | CleanMap</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Work Order Details</h1>
        <p>Details for work order ID: {id}</p>
      </div>
    </div>
  );
};

export default WorkOrderDetails;

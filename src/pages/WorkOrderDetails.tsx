import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

const WorkOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <PageLayout>
      <Helmet>
        <title>Work Order Details | CleanMap</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Work Order Details</h1>
        <p>Details for work order ID: {id}</p>
      </div>
    </PageLayout>
  );
};

export default WorkOrderDetails;

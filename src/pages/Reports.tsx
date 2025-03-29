
import React from "react";
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Helmet } from "react-helmet-async";

const Reports: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Reports | CleanMap</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        <p>Reports and analytics will be displayed here</p>
      </div>
    </PageLayout>
  );
};

export default Reports;

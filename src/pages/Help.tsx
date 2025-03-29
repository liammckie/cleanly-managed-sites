
import React from "react";
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Helmet } from "react-helmet-async";

const Help: React.FC = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Help & Support | CleanMap</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
        <p>Support resources and documentation will be displayed here</p>
      </div>
    </PageLayout>
  );
};

export default Help;

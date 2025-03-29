
import React from "react";
import { PageLayout } from '@/components/ui/layout/PageLayout';

const Invoices: React.FC = () => {
  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Invoices</h1>
        <p>Invoice list will be displayed here</p>
      </div>
    </PageLayout>
  );
};

export default Invoices;

import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Helmet } from "react-helmet-async";
import { useParams } from 'react-router-dom';

const QuoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <PageLayout>
      <Helmet>
        <title>Quote Detail | CleanMap</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Quote Detail</h1>
        <p>Details for quote with ID: {id} will be displayed here</p>
      </div>
    </PageLayout>
  );
};

export default QuoteDetail;

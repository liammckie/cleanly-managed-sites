
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuote } from '@/hooks/quotes/useQuote';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const EditQuote = () => {
  const { id } = useParams<{ id: string }>();
  const { quote, isLoading, isError, error } = useQuote(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-500">
          <h3 className="text-xl font-semibold mb-2">Error Loading Quote</h3>
          <p>{error?.message || 'Unknown error occurred'}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Edit Quote: {quote?.name}</h1>
        {/* Quote editing form would go here */}
      </div>
    </DashboardLayout>
  );
};

export default EditQuote;

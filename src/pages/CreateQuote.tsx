
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { QuoteForm } from '@/components/quoting/QuoteForm';

const CreateQuote = () => {
  return (
    <PageLayout>
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <QuoteForm />
      </div>
    </PageLayout>
  );
};

export default CreateQuote;

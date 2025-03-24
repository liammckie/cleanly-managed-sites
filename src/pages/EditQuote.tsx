
import React from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useQuote } from '@/hooks/useQuotes';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { QuoteForm } from '@/components/quoting/QuoteForm';

const EditQuote = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const { quote, isLoading, error } = useQuote(quoteId!);
  
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-center text-destructive">
                <h3 className="text-xl font-semibold mb-2">Error Loading Quote</h3>
                <p>{(error as any)?.message || 'Unable to load quote details'}</p>
              </div>
            ) : quote ? (
              <QuoteForm quoteId={quoteId} initialData={quote} />
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Quote Not Found</h3>
                <p>The requested quote could not be found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EditQuote;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotes } from '@/hooks/useQuotes';
import { QuoteList } from './QuoteList';
import { QuoteStats } from './QuoteStats';
import { QuoteFilter } from './QuoteFilter';
import { QuotesEmptyState } from './QuotesEmptyState';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { adaptModelsToQuotes } from '@/lib/utils/quoteTypeAdapter';

export function QuotingDashboard() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const { data: quotes, isLoading, error } = useQuotes();
  const [filteredQuotes, setFilteredQuotes] = useState<any[]>([]);

  // Convert quotes to the format expected by the QuoteList component
  useEffect(() => {
    if (quotes) {
      // Adapt quotes to the format expected by the components
      const adaptedQuotes = adaptModelsToQuotes(quotes);
      
      // Apply filtering
      if (activeFilter === 'all') {
        setFilteredQuotes(adaptedQuotes);
      } else {
        setFilteredQuotes(
          adaptedQuotes.filter(quote => quote.status === activeFilter)
        );
      }
    }
  }, [quotes, activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleCreateNew = () => {
    navigate('/quoting/create');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Error loading quotes</h3>
        <p className="text-red-600">{(error as Error).message}</p>
      </div>
    );
  }

  if (!quotes || quotes.length === 0) {
    return <QuotesEmptyState onCreateNew={handleCreateNew} />;
  }

  // Calculate some statistics about quotes
  const totalValue = filteredQuotes.reduce(
    (sum, quote) => sum + (quote.total_price || 0), 
    0
  );
  
  const averageValue = filteredQuotes.length > 0 
    ? totalValue / filteredQuotes.length 
    : 0;
  
  const pendingCount = filteredQuotes.filter(
    quote => quote.status === 'pending'
  ).length;
  
  const approvedCount = filteredQuotes.filter(
    quote => quote.status === 'approved'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <QuoteStats 
          pending={pendingCount}
          approved={approvedCount}
          total={filteredQuotes.length}
          value={totalValue}
          average={averageValue}
        />
      </div>
      
      <div>
        <QuoteFilter 
          filter={activeFilter} 
          onChange={handleFilterChange}
          count={filteredQuotes.length}
        />
        <QuoteList 
          quotes={filteredQuotes} 
          searchTerm=""
          isLoading={false}
        />
      </div>
    </div>
  );
}

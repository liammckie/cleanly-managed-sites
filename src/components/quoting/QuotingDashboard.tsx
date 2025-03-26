
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchQuotes } from '@/hooks/quotes/useFetchQuotes';
import { QuoteFilter } from './QuoteFilter';
import { QuotesList } from './QuotesList';
import { QuoteStats } from './QuoteStats';
import { QuotesEmptyState } from './QuotesEmptyState';
import { QuoteListSkeleton } from './QuoteListSkeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Quote } from '@/lib/types/quotes';

export function QuotingDashboard() {
  const navigate = useNavigate();
  const { data: quotes, isLoading, error } = useFetchQuotes();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleCreateNewQuote = () => {
    navigate('/quotes/create');
  };
  
  const filteredQuotes: Quote[] = React.useMemo(() => {
    if (!quotes) return [];
    
    return quotes.filter(quote => {
      const matchesStatus = !statusFilter || quote.status === statusFilter;
      const matchesSearch = !searchQuery || 
        quote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quote.clientName || quote.client_name).toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [quotes, statusFilter, searchQuery]);
  
  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quotes</h1>
          <Button onClick={handleCreateNewQuote}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Quote
          </Button>
        </div>
        <QuoteListSkeleton />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quotes</h1>
          <Button onClick={handleCreateNewQuote}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Quote
          </Button>
        </div>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-medium">Error loading quotes</p>
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      </div>
    );
  }
  
  if (!quotes || quotes.length === 0) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quotes</h1>
        </div>
        <QuotesEmptyState onCreateNew={handleCreateNewQuote} />
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <Button onClick={handleCreateNewQuote}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Quote
        </Button>
      </div>
      
      <QuoteStats quotes={quotes} />
      
      <QuoteFilter
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
      
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No quotes match your filters. Clear filters to see all quotes.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setStatusFilter(null);
              setSearchQuery('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <QuotesList quotes={filteredQuotes} />
      )}
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchQuotes } from '@/hooks/quotes/useFetchQuotes';
import { QuoteFilter } from './QuoteFilter';
import { QuotesList } from './QuotesList';
import { QuoteStats } from './QuoteStats';
import { QuotesEmptyState } from './QuotesEmptyState';
import { QuoteListSkeleton } from './QuoteListSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Quote } from '@/lib/types/quotes';

export function QuotingDashboard() {
  const navigate = useNavigate();
  const { data: fetchedQuotes, isLoading, isError } = useFetchQuotes();
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter quotes based on status and search query
  useEffect(() => {
    if (!fetchedQuotes) {
      setFilteredQuotes([]);
      return;
    }

    // First apply status filter
    let filtered = fetchedQuotes as Quote[];
    if (statusFilter) {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }

    // Then apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(quote => 
        quote.name.toLowerCase().includes(query) ||
        quote.client_name.toLowerCase().includes(query) ||
        (quote.site_name && quote.site_name.toLowerCase().includes(query))
      );
    }

    setFilteredQuotes(filtered);
  }, [fetchedQuotes, statusFilter, searchQuery]);

  const handleCreateNew = () => {
    navigate('/quotes/new');
  };

  const handleQuoteClick = (quoteId: string) => {
    navigate(`/quotes/${quoteId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Quotes</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Quote
        </Button>
      </div>

      <QuoteStats quotes={filteredQuotes as any} isLoading={isLoading} />

      <Card>
        <CardHeader>
          <CardTitle>Quote Management</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteFilter 
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
          
          {isLoading ? (
            <QuoteListSkeleton />
          ) : isError ? (
            <div className="p-8 text-center">
              <h3 className="font-medium text-lg mb-2">Error loading quotes</h3>
              <p className="text-muted-foreground">There was a problem fetching your quotes. Please try again.</p>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <QuotesEmptyState onCreateNew={handleCreateNew} />
          ) : (
            <QuotesList 
              quotes={filteredQuotes as any}
              onQuoteClick={handleQuoteClick}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

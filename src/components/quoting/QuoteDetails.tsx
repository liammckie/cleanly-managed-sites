
import React, { useState, useEffect } from 'react';
import { useQuotes } from '@/hooks/quotes';
import { useQuote } from '@/hooks/quotes/useQuote';
import { Quote } from '@/lib/types/quotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWrapper } from '@/components/ui/date-picker/DatePickerWrapper';
import { Loader2 } from 'lucide-react';

export interface QuoteDetailsProps {
  quote: Quote | null;
  onQuoteSelect: (quoteId: string) => void;
}

export function QuoteDetails({ quote, onQuoteSelect }: QuoteDetailsProps) {
  const { data: quotes, isLoading: isLoadingQuotes } = useQuotes();
  const [formState, setFormState] = useState<Partial<Quote>>({
    name: '',
    clientName: '',
    siteName: '',
    status: 'draft',
    description: '',
    notes: ''
  });

  // When a quote is selected, update the form state
  useEffect(() => {
    if (quote) {
      setFormState(quote);
    }
  }, [quote]);

  const handleInputChange = (field: keyof Quote, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="selectQuote">Select Existing Quote</Label>
          <Select
            onValueChange={(value) => onQuoteSelect(value)}
            value={quote?.id}
            disabled={isLoadingQuotes}
          >
            <SelectTrigger id="selectQuote">
              <SelectValue placeholder="Select a quote" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingQuotes ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading quotes...</span>
                </div>
              ) : (
                quotes?.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Quote Name</Label>
          <Input
            id="name"
            value={formState.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter a name for this quote"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={formState.clientName || formState.client_name || ''}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            placeholder="Enter client name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            value={formState.siteName || formState.site_name || ''}
            onChange={(e) => handleInputChange('siteName', e.target.value)}
            placeholder="Enter site name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formState.status || 'draft'}
            onValueChange={(value) => handleInputChange('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formState.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter a detailed description of the quote"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formState.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Enter any additional notes"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <DatePickerWrapper
            value={formState.startDate ? new Date(formState.startDate) : new Date()}
            onChange={(date) => handleInputChange('startDate', date.toISOString().split('T')[0])}
          />
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <DatePickerWrapper
            value={formState.endDate ? new Date(formState.endDate) : new Date()}
            onChange={(date) => handleInputChange('endDate', date.toISOString().split('T')[0])}
          />
        </div>

        <div className="space-y-2">
          <Label>Expiry Date</Label>
          <DatePickerWrapper
            value={formState.expiryDate ? new Date(formState.expiryDate) : new Date()}
            onChange={(date) => handleInputChange('expiryDate', date.toISOString().split('T')[0])}
          />
        </div>
      </div>
    </div>
  );
}

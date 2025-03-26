
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface QuoteFilterProps {
  filter: string;
  onChange: (filter: string) => void;
  count: number;
}

export const QuoteFilter = ({ filter, onChange, count }: QuoteFilterProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Tabs value={filter} onValueChange={onChange} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Quotes</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
      <span className="text-sm text-muted-foreground ml-4">
        {count} {count === 1 ? 'quote' : 'quotes'}
      </span>
    </div>
  );
};

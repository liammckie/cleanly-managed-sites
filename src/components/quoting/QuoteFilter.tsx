
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuoteFilterProps {
  statusFilter: string | null;
  onStatusFilterChange: (value: string | null) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

export function QuoteFilter({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: QuoteFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="w-full md:w-1/3">
        <Input
          placeholder="Search quotes..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full md:w-1/3">
        <Select
          value={statusFilter || ''}
          onValueChange={(value) => onStatusFilterChange(value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

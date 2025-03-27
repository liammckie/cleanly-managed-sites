
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface ClientSelectorProps {
  value?: string;
  onChange: (clientId: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  includeInactive?: boolean;
}

export function ClientSelector({
  value,
  onChange,
  className,
  placeholder = "Select a client",
  disabled = false,
  includeInactive = false
}: ClientSelectorProps) {
  // Fetch clients data
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        return await response.json();
      } catch (error) {
        console.error('Error fetching clients:', error);
        return [];
      }
    }
  });
  
  // Filter clients based on status if needed
  const filteredClients = includeInactive
    ? clients
    : clients.filter((client: any) => client.status === 'active');

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading clients...</span>
      </div>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filteredClients.length > 0 ? (
          filteredClients.map((client: any) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-clients" disabled>
            No clients found
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}


import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { FormControl, FormLabel, FormItem, FormMessage } from '@/components/ui/form';
import { useClients } from '@/hooks/useClients';

export interface ClientSelectorProps {
  clientId: string;
  onClientChange: (clientId: string) => void;
  error?: string;
  label?: string;
}

export function ClientSelector({ 
  clientId, 
  onClientChange, 
  error, 
  label = "Client" 
}: ClientSelectorProps) {
  const { clients, isLoading } = useClients();
  const [selectedId, setSelectedId] = useState(clientId || '');

  useEffect(() => {
    setSelectedId(clientId || '');
  }, [clientId]);

  const handleChange = (value: string) => {
    setSelectedId(value);
    onClientChange(value);
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select 
        value={selectedId} 
        onValueChange={handleChange}
        disabled={isLoading}
      >
        <FormControl>
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {clients?.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}

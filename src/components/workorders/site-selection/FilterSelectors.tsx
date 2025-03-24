
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { FormLabel } from '@/components/ui/form';

interface FilterSelectorsProps {
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  stateFilter: string;
  setStateFilter: (state: string) => void;
  clients: any[];
  availableStates: string[];
}

export const FilterSelectors = ({
  selectedClientId,
  setSelectedClientId,
  stateFilter,
  setStateFilter,
  clients,
  availableStates
}: FilterSelectorsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <FormLabel>Filter by Client</FormLabel>
        <Select 
          value={selectedClientId} 
          onValueChange={setSelectedClientId}
        >
          <SelectTrigger>
            <SelectValue placeholder="All clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-clients">All clients</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FormLabel>Filter by State</FormLabel>
        <Select 
          value={stateFilter} 
          onValueChange={setStateFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="All states" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-states">All states</SelectItem>
            {availableStates.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

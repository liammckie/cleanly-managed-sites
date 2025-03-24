
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useClients } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClientSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ClientSelect({ value, onChange, error }: ClientSelectProps) {
  const { clients, isLoading } = useClients();
  const navigate = useNavigate();
  
  // Handle empty or invalid values
  const handleChange = (newValue: string) => {
    // Validate the ID before passing it up
    if (newValue && clients.some(client => client.id === newValue)) {
      onChange(newValue);
    } else if (newValue === 'default') {
      // Use a non-empty default value when clearing the selection
      onChange('default');
    }
  };
  
  // Ensure we have a valid value
  const safeValue = value || 'default';
  
  return (
    <div className="flex space-x-2">
      <div className="flex-1">
        <Select value={safeValue} onValueChange={handleChange}>
          <SelectTrigger className={`glass-input ${error ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Select a client</SelectItem>
            {isLoading ? (
              <SelectItem value="loading">Loading clients...</SelectItem>
            ) : clients.length > 0 ? (
              clients.map(client => (
                <SelectItem key={client.id} value={client.id || `client-${client.name}`}>
                  {client.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-clients">No clients found</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <Button
        size="sm"
        variant="outline"
        className="flex-shrink-0"
        onClick={(e) => {
          e.preventDefault();
          navigate('/clients/create');
        }}
      >
        <Plus size={16} />
      </Button>
    </div>
  );
}

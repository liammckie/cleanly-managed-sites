
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
  
  return (
    <div className="flex space-x-2">
      <div className="flex-1">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={`glass-input ${error ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>Loading clients...</SelectItem>
            ) : clients.length > 0 ? (
              clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>No clients found</SelectItem>
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

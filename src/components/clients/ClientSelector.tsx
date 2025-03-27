
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/useClients';
import { Loader2, Search, X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

export interface ClientSelectorProps {
  clientId: string;
  onClientChange: (clientId: string) => void;
  error?: string;
  // Add optional backward compatibility properties
  selectedClientId?: string;
  onClientSelect?: (clientId: string) => void;
}

export function ClientSelector({ 
  clientId, 
  onClientChange,
  error,
  selectedClientId,
  onClientSelect
}: ClientSelectorProps) {
  const { clients = [], isLoading } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // For compatibility with both prop patterns
  const effectiveClientId = selectedClientId || clientId;
  const effectiveOnChange = onClientSelect || onClientChange;
  
  // Find selected client
  const selectedClient = clients?.find(client => client.id === effectiveClientId);
  
  // Filter clients based on search term
  const filteredClients = clients?.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Close popover when a client is selected
  useEffect(() => {
    if (effectiveClientId) {
      setIsOpen(false);
    }
  }, [effectiveClientId]);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="client">Client <span className="text-destructive">*</span></Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
          >
            {selectedClient ? selectedClient.name : "Select client..."}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="flex items-center p-2 border-b">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-70" />
            <Input
              placeholder="Search clients..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2">Loading clients...</span>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-auto">
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <div
                    key={client.id}
                    className={`flex items-center justify-between p-2 cursor-pointer hover:bg-muted ${
                      client.id === effectiveClientId ? 'bg-muted' : ''
                    }`}
                    onClick={() => {
                      effectiveOnChange(client.id);
                      setIsOpen(false);
                    }}
                  >
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.contact_name}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No clients found
                </div>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

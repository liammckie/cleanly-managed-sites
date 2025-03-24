
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientRecord } from '@/lib/types';

interface ClientSelectorDialogProps {
  showClientSelector: boolean;
  setShowClientSelector: (show: boolean) => void;
  clients: ClientRecord[];
  isLoadingClients: boolean;
  handleClientSelect: (clientId: string) => void;
}

export const ClientSelectorDialog = ({
  showClientSelector,
  setShowClientSelector,
  clients,
  isLoadingClients,
  handleClientSelect
}: ClientSelectorDialogProps) => {
  return (
    <Dialog open={showClientSelector} onOpenChange={setShowClientSelector}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Client</DialogTitle>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto">
          {isLoadingClients ? (
            <div className="p-4 text-center">Loading clients...</div>
          ) : (
            <div className="grid gap-2">
              {clients.map(client => (
                <div
                  key={client.id}
                  className="p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleClientSelect(client.id)}
                >
                  <div className="font-medium">{client.name}</div>
                  {client.city && (
                    <div className="text-sm text-muted-foreground">
                      {client.city}{client.state ? `, ${client.state}` : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

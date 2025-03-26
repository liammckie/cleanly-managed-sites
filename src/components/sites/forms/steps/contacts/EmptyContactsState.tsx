
import React from 'react';
import { UserPlus, UserSearch } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyContactsStateProps {
  addContact: () => void;
  addExistingContact?: (contactId: string) => void;
}

export function EmptyContactsState({ addContact, addExistingContact }: EmptyContactsStateProps) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
        <UserPlus className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">No contacts added yet</h3>
        <p className="text-sm text-muted-foreground text-center">
          Add contacts to this site to track who to get in touch with for various needs.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            onClick={addContact} 
            variant="default"
            className="gap-1"
          >
            <UserPlus className="h-4 w-4" />
            Add New Contact
          </Button>
          {addExistingContact && (
            <Button 
              onClick={() => {}} 
              variant="outline"
              className="gap-1"
            >
              <UserSearch className="h-4 w-4" />
              Use Existing Contact
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

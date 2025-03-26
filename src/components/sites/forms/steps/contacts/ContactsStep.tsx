
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ContactForm from './ContactForm';
import ContactCard from './ContactCard';
import { SiteContact } from '../../types/contactTypes';
import { adaptContactForUI, adaptContactsForAPI } from './contactsAdapter';
import { SiteFormData } from '../../types/siteFormData';
import { UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { EntitySearchSelector } from '@/components/contacts/form/EntitySearchSelector';
import { ClientInfoSwitch } from './ClientInfoSwitch';
import { EmptyContactsState } from './EmptyContactsState';

export interface ContactsStepProps {
  formData: SiteFormData;
  errors: Record<string, string>;
  handleContactChange: (index: number, field: string, value: any) => void;
  addContact: () => void;
  removeContact: (index: number) => void;
  addExistingContact?: (contactId: string) => void;
  setAsPrimary?: (index: number) => void;
  toggleUseClientInfo?: (value: boolean) => void;
}

export function ContactsStep({
  formData,
  errors,
  handleContactChange,
  addContact,
  removeContact,
  addExistingContact,
  setAsPrimary,
  toggleUseClientInfo
}: ContactsStepProps) {
  return (
    <div className="space-y-6">
      {/* Client Info Switch */}
      {formData.clientId && formData.clientId.trim() !== '' && (
        <ClientInfoSwitch 
          useClientInfo={formData.useClientInfo || false}
          toggleUseClientInfo={toggleUseClientInfo}
        />
      )}

      {/* Section Title and Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Site Contacts</h2>
        <div className="flex gap-2">
          {addExistingContact && (
            <EntitySearchSelector 
              entityType="contact"
              onEntitySelect={addExistingContact}
              placeholder="Search for a contact..."
            />
          )}
          <AddContactButton onClick={addContact} />
        </div>
      </div>
      
      {/* Validation Error Alert */}
      {errors['contacts'] && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors['contacts']}</AlertDescription>
        </Alert>
      )}
      
      {/* Contact Cards or Empty State */}
      {formData.contacts && formData.contacts.length > 0 ? (
        <div className="grid gap-4">
          {formData.contacts.map((contact: SiteContact, index: number) => (
            <ContactCard
              key={contact.id || index}
              contact={contact}
              onEdit={() => handleContactEdit(index, contact)}
              onDelete={() => removeContact(index)}
              isPrimary={contact.is_primary || false}
            />
          ))}
        </div>
      ) : (
        <EmptyContactsState 
          addContact={addContact} 
          addExistingContact={addExistingContact} 
        />
      )}
    </div>
  );
  
  // Helper function for handling contact edit
  function handleContactEdit(index: number, contact: SiteContact) {
    // Open dialog with contact form for editing
    // This could be implemented in a more sophisticated way with a state-managed dialog
    // For simplicity, we're just passing it through to the handler
    console.log(`Editing contact at index ${index}:`, contact);
  }
}

// Helper components for the main component
const AddContactButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    type="button"
    onClick={onClick}
    variant="outline"
    size="sm"
    className="flex items-center gap-1"
  >
    <UserPlus className="h-4 w-4" />
    Add New Contact
  </Button>
);

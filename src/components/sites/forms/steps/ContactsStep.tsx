
import React from 'react';
import { SiteFormData } from '../siteFormTypes';
import { SiteContact } from '../types/contactTypes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, X, Star, UserCheck } from 'lucide-react';
import { EntitySearchSelector } from '@/components/contacts/form/EntitySearchSelector';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormItem, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  // Handle adding an existing contact
  const handleExistingContactSelect = (contactId: string) => {
    if (addExistingContact && contactId) {
      console.log('Adding existing contact with ID:', contactId);
      addExistingContact(contactId);
    } else {
      console.warn('Cannot add contact - either addExistingContact function is missing or contactId is invalid');
    }
  };

  // Handle setting a contact as primary
  const handleSetAsPrimary = (index: number) => {
    if (setAsPrimary) {
      setAsPrimary(index);
    } else {
      // Fallback if setAsPrimary is not provided
      formData.contacts.forEach((contact, i) => {
        handleContactChange(i, 'is_primary', i === index);
      });
    }
  };

  return (
    <div className="space-y-6">
      {formData.clientId && formData.clientId.trim() !== '' && (
        <FormItem className="flex items-center space-x-2">
          <Switch 
            id="useClientInfo" 
            checked={formData.useClientInfo || false}
            onCheckedChange={(value) => {
              if (toggleUseClientInfo) {
                toggleUseClientInfo(value);
              }
            }}
          />
          <Label htmlFor="useClientInfo" className="cursor-pointer">
            Use client information for billing details
          </Label>
        </FormItem>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Site Contacts</h2>
        <div className="flex gap-2">
          {addExistingContact && (
            <div className="w-64">
              <EntitySearchSelector 
                entityType="contact"
                onEntitySelect={handleExistingContactSelect}
                placeholder="Search for a contact..."
              />
            </div>
          )}
          <Button
            type="button"
            onClick={addContact}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <UserPlus className="h-4 w-4" />
            Add New Contact
          </Button>
        </div>
      </div>
      
      {errors['contacts'] && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors['contacts']}</AlertDescription>
        </Alert>
      )}
      
      {formData.contacts && formData.contacts.length > 0 ? (
        <div className="grid gap-4">
          {formData.contacts.map((contact: SiteContact, index: number) => (
            <Card key={contact.id || index} className={`p-4 border-2 ${contact.is_primary ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}>
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{contact.name || `Contact #${index + 1}`}</h3>
                  {contact.is_primary && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      Primary Contact
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {!contact.is_primary && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetAsPrimary(index)}
                      className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 h-8"
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Make Primary
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContact(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={contact.name || ''}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`contacts[${index}].name`] ? 'border-destructive' : ''}`}
                    placeholder="Full name"
                  />
                  {errors[`contacts[${index}].name`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`contacts[${index}].name`]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={contact.role || ''}
                    onChange={(e) => handleContactChange(index, 'role', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Position or role"
                  />
                  {errors[`contacts[${index}].role`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`contacts[${index}].role`]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email <span className="text-destructive">*</span></label>
                  <input
                    type="email"
                    value={contact.email || ''}
                    onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`contacts[${index}].email`] ? 'border-destructive' : ''}`}
                    placeholder="Email address"
                  />
                  {errors[`contacts[${index}].email`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`contacts[${index}].email`]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={contact.phone || ''}
                    onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <input
                    type="text"
                    value={contact.department || ''}
                    onChange={(e) => handleContactChange(index, 'department', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Department"
                  />
                </div>
                
                <div className="flex items-center h-full pt-5">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contact.is_primary || false}
                      onChange={(e) => handleContactChange(index, 'is_primary', e.target.checked)}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 h-4 w-4 mr-2"
                    />
                    <span className="text-sm font-medium">Primary contact</span>
                  </label>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-md bg-gray-50">
          <p className="text-gray-500 mb-4">No contacts added yet. <span className="text-destructive font-medium">At least one contact is required.</span></p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              type="button"
              onClick={addContact}
              variant="outline"
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              Add New Contact
            </Button>
            
            {addExistingContact && (
              <Button
                type="button"
                variant="secondary"
                className="flex items-center gap-1"
                onClick={() => document.querySelector('[role="combobox"]')?.dispatchEvent(new MouseEvent('click'))}
              >
                <UserCheck className="h-4 w-4" />
                Select Existing Contact
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

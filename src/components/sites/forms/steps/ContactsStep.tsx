
import React from 'react';
import { SiteFormData } from '../siteFormTypes';
import { SiteContact } from '../types/contactTypes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, X, StarIcon, Star } from 'lucide-react';

export interface ContactsStepProps {
  formData: SiteFormData;
  errors: Record<string, string>;
  handleContactChange: (index: number, field: string, value: any) => void;
  addContact: () => void;
  removeContact: (index: number) => void;
}

export function ContactsStep({
  formData,
  errors,
  handleContactChange,
  addContact,
  removeContact
}: ContactsStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Site Contacts</h2>
        <Button
          type="button"
          onClick={addContact}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <UserPlus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>
      
      {formData.contacts && formData.contacts.length > 0 ? (
        <div className="grid gap-4">
          {formData.contacts.map((contact: SiteContact, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{contact.name || `Contact #${index + 1}`}</h3>
                  {contact.is_primary && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      Primary
                    </Badge>
                  )}
                </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={contact.name || ''}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={contact.email || ''}
                    onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email address"
                  />
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
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                    />
                    <span className="text-sm font-medium">Set as primary contact</span>
                  </label>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-md bg-gray-50">
          <p className="text-gray-500 mb-4">No contacts added yet.</p>
          <Button
            type="button"
            onClick={addContact}
            variant="outline"
            className="flex items-center gap-1"
          >
            <UserPlus className="h-4 w-4" />
            Add First Contact
          </Button>
        </div>
      )}
    </div>
  );
}

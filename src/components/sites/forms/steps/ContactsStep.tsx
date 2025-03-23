
import React from 'react';
import { SiteFormData } from '../siteFormTypes';
import { SiteContact } from '../types/contactTypes';

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
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Site Contacts</h2>
      
      {formData.contacts && formData.contacts.length > 0 ? (
        <div className="grid gap-4">
          {formData.contacts.map((contact: SiteContact, index: number) => (
            <div key={index} className="border p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">{contact.name || `Contact #${index + 1}`}</h3>
                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    type="text"
                    value={contact.name || ''}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Role</label>
                  <input
                    type="text"
                    value={contact.role || ''}
                    onChange={(e) => handleContactChange(index, 'role', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={contact.email || ''}
                    onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Phone</label>
                  <input
                    type="tel"
                    value={contact.phone || ''}
                    onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-gray-500">No contacts added yet.</p>
        </div>
      )}
      
      <div className="flex justify-center">
        <button
          type="button"
          onClick={addContact}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Contact
        </button>
      </div>
    </div>
  );
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SiteContact } from '../../types/contactTypes';
import { Star, X } from 'lucide-react';

interface ContactCardProps {
  contact: SiteContact;
  index: number;
  errors: Record<string, string>;
  isPrimary: boolean;
  handleContactChange: (index: number, field: string, value: any) => void;
  removeContact: (index: number) => void;
  setAsPrimary?: (index: number) => void;
}

export function ContactCard({
  contact,
  index,
  errors,
  isPrimary,
  handleContactChange,
  removeContact,
  setAsPrimary
}: ContactCardProps) {
  // Handle setting a contact as primary
  const handleSetAsPrimary = () => {
    if (setAsPrimary) {
      setAsPrimary(index);
    } else {
      // Fallback if setAsPrimary is not provided
      handleContactChange(index, 'is_primary', true);
    }
  };

  return (
    <Card className={`p-4 border-2 ${isPrimary ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}>
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{contact.name || `Contact #${index + 1}`}</h3>
          {isPrimary && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              Primary Contact
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {!isPrimary && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSetAsPrimary}
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
      
      <ContactFormFields 
        contact={contact}
        index={index}
        errors={errors}
        handleContactChange={handleContactChange}
      />
    </Card>
  );
}

// Contact form fields component
function ContactFormFields({ 
  contact, 
  index, 
  errors, 
  handleContactChange 
}: { 
  contact: SiteContact; 
  index: number; 
  errors: Record<string, string>; 
  handleContactChange: (index: number, field: string, value: any) => void; 
}) {
  return (
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
  );
}

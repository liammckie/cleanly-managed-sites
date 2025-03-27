import React, { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { contactFormSchema } from '@/lib/validation/contactSchema';
import { validateWithZod } from '@/utils/zodValidation';
import { FormField, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface ContactFormProps {
  initialData: {
    id?: string;
    name?: string;
    role?: string;
    department?: string;
    email?: string;
    phone?: string;
    notes?: string;
    is_primary?: boolean;
    entity_type?: string;
    entity_id?: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ContactForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}: ContactFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset validation errors
    setValidationErrors({});
    
    // Validate with Zod
    const result = validateWithZod(contactFormSchema, formData);
    
    if (!result.success) {
      setValidationErrors(result.errors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    // If validation passes, proceed with form submission
    onSubmit(result.data);
  };
  
  return (
    <Form>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={validationErrors.name ? 'border-red-500' : ''}
          />
          {validationErrors.name && <FormMessage>{validationErrors.name}</FormMessage>}
        </FormField>
        
        <FormField>
          <FormLabel htmlFor="role">Role</FormLabel>
          <Input
            id="role"
            name="role"
            value={formData.role || ''}
            onChange={handleChange}
            className={validationErrors.role ? 'border-red-500' : ''}
          />
          {validationErrors.role && <FormMessage>{validationErrors.role}</FormMessage>}
        </FormField>
        
        <FormField>
          <FormLabel htmlFor="department">Department</FormLabel>
          <Input
            id="department"
            name="department"
            value={formData.department || ''}
            onChange={handleChange}
          />
        </FormField>
        
        <FormField>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={validationErrors.email ? 'border-red-500' : ''}
          />
          {validationErrors.email && <FormMessage>{validationErrors.email}</FormMessage>}
        </FormField>
        
        <FormField>
          <FormLabel htmlFor="phone">Phone</FormLabel>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
          />
        </FormField>
        
        <FormField>
          <FormLabel htmlFor="notes">Notes</FormLabel>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
          />
        </FormField>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_primary"
            checked={formData.is_primary || false}
            onCheckedChange={(checked) => handleCheckboxChange('is_primary', checked as boolean)}
          />
          <label htmlFor="is_primary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Primary Contact
          </label>
        </div>
        
        {validationErrors._general && (
          <div className="text-red-500 text-sm">{validationErrors._general}</div>
        )}
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Contact'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

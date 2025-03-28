
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { contactSchema, EntityType } from './contactSchema';
import { ContactRecord } from '@/lib/types';

export interface ContactFormProps {
  initialData?: Partial<ContactRecord>;
  onSubmit: (data: Partial<ContactRecord>) => Promise<void>;
  isSubmitting?: boolean;
  entityType: EntityType;
  entityId: string;
}

export function ContactForm({ initialData, onSubmit, isSubmitting = false, entityType, entityId }: ContactFormProps) {
  const [formData, setFormData] = useState<Partial<ContactRecord>>(initialData || {
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    notes: '',
    is_primary: false,
    entity_type: entityType,
    entity_id: entityId
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when it changes
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    try {
      contactSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path.join('.');
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Include entity information in submission
    const contactData = {
      ...formData,
      entity_type: entityType,
      entity_id: entityId
    };
    
    await onSubmit(contactData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
          <Input 
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Full name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
          <Input 
            id="role"
            value={formData.role || ''}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder="e.g. Operations Manager"
            className={errors.role ? 'border-red-500' : ''}
          />
          {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="department">Department</Label>
          <Input 
            id="department"
            value={formData.department || ''}
            onChange={(e) => handleChange('department', e.target.value)}
            placeholder="e.g. Operations"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Phone number"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Additional information about this contact"
            rows={3}
          />
        </div>
        
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox 
            id="isPrimary" 
            checked={formData.is_primary || false}
            onCheckedChange={(checked) => handleChange('is_primary', checked)}
          />
          <Label htmlFor="isPrimary" className="text-sm font-normal">
            Set as primary contact
          </Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData?.id ? 'Update Contact' : 'Add Contact'}
        </Button>
      </div>
    </form>
  );
}

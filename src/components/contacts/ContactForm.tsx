
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ContactRecord } from '@/lib/types';
import { contactSchema, ContactFormValues, EntityType, AssignmentType } from './contactSchema';
import { Form } from '@/components/ui/form';
import { EntityTypeSelector } from './form/EntityTypeSelector';
import { AssignmentTypeSelector } from './form/AssignmentTypeSelector';
import { EntitySearchSelector } from './form/EntitySearchSelector';
import { ContactFormFields } from './form/ContactFormFields';
import { BulkAssignmentNotice } from './form/BulkAssignmentNotice';

export interface ContactFormProps {
  contact?: ContactRecord;
  entityType?: EntityType;
  entityId?: string;
  onSubmit: (values: Partial<ContactRecord>) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ContactForm({
  contact,
  entityType: initialEntityType,
  entityId: initialEntityId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ContactFormProps) {
  const [entityType, setEntityType] = useState<EntityType>(
    (initialEntityType || contact?.entity_type || 'client') as EntityType
  );
  const [entityId, setEntityId] = useState<string>(initialEntityId || contact?.entity_id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>(
    !contact?.entity_id ? 'single' :
    contact.entity_id === 'all_sites' ? 'all_sites' :
    contact.entity_id === 'all_clients' ? 'all_clients' : 'single'
  );

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name || '',
      role: contact?.role || '',
      department: contact?.department || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      notes: contact?.notes || '',
      is_primary: contact?.is_primary || false,
    },
  });

  // Handle entity type change
  const handleEntityTypeChange = (value: EntityType) => {
    setEntityType(value);
    setEntityId('');
    setSearchTerm('');
    setAssignmentType('single');
  };

  // Handle assignment type change
  const handleAssignmentTypeChange = (value: AssignmentType) => {
    setAssignmentType(value);
    if (value === 'all_sites') {
      setEntityId('all_sites');
      setSearchTerm('All Sites');
    } else if (value === 'all_clients') {
      setEntityId('all_clients');
      setSearchTerm('All Clients');
    } else {
      setEntityId('');
      setSearchTerm('');
    }
  };

  const handleEntitySelect = (id: string, name: string) => {
    setEntityId(id);
    setSearchTerm(name);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value === '') {
      setEntityId('');
    }
  };

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      const entityData = {
        ...values,
        entity_type: entityType,
        entity_id: entityType === 'internal' ? null : entityId,
        ...(contact?.id ? { id: contact.id } : {}),
      };
      
      await onSubmit(entityData as Partial<ContactRecord>);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-4">
            <EntityTypeSelector 
              value={entityType} 
              onChange={handleEntityTypeChange} 
            />

            <AssignmentTypeSelector 
              entityType={entityType} 
              value={assignmentType} 
              onChange={handleAssignmentTypeChange} 
            />

            <EntitySearchSelector 
              entityType={entityType}
              assignmentType={assignmentType}
              entityId={entityId}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onEntitySelect={handleEntitySelect}
            />

            <BulkAssignmentNotice assignmentType={assignmentType} />
          </div>
          
          <ContactFormFields 
            entityType={entityType} 
            assignmentType={assignmentType} 
          />
          
          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting || (entityType !== 'internal' && assignmentType === 'single' && !entityId)}
            >
              {isSubmitting ? 'Saving...' : (contact ? 'Update Contact' : 'Add Contact')}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}

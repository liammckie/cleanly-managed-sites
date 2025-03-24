
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AssignmentType, EntityType } from '../contactSchema';

interface AssignmentTypeSelectorProps {
  entityType: EntityType;
  value: AssignmentType;
  onChange: (value: AssignmentType) => void;
}

export function AssignmentTypeSelector({ 
  entityType, 
  value, 
  onChange 
}: AssignmentTypeSelectorProps) {
  if (entityType === 'internal') {
    return null;
  }

  return (
    <div className="space-y-2">
      <FormLabel>Assignment Type</FormLabel>
      <RadioGroup 
        value={value}
        onValueChange={(value: AssignmentType) => onChange(value)}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="single" id="single" />
          <label htmlFor="single" className="cursor-pointer text-sm">
            Single {entityType}
          </label>
        </div>
        
        {entityType === 'site' && (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all_sites" id="all_sites" />
            <label htmlFor="all_sites" className="cursor-pointer text-sm">
              All Sites
            </label>
          </div>
        )}
        
        {entityType === 'client' && (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all_clients" id="all_clients" />
            <label htmlFor="all_clients" className="cursor-pointer text-sm">
              All Clients
            </label>
          </div>
        )}
      </RadioGroup>
    </div>
  );
}

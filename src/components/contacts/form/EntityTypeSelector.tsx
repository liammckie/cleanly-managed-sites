
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building, Store, Truck, Users } from 'lucide-react';
import { EntityType } from '../contactSchema';

interface EntityTypeSelectorProps {
  value: EntityType;
  onChange: (value: EntityType) => void;
}

export function EntityTypeSelector({ value, onChange }: EntityTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <FormLabel>Associated With</FormLabel>
      <Select
        value={value}
        onValueChange={(value: EntityType) => onChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select entity type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="client" className="flex items-center">
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              <span>Client</span>
            </div>
          </SelectItem>
          <SelectItem value="site" className="flex items-center">
            <div className="flex items-center">
              <Store className="h-4 w-4 mr-2" />
              <span>Site</span>
            </div>
          </SelectItem>
          <SelectItem value="supplier" className="flex items-center">
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              <span>Supplier</span>
            </div>
          </SelectItem>
          <SelectItem value="internal" className="flex items-center">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Internal</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

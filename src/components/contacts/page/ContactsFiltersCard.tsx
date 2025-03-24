
import React from 'react';
import { Card } from '@/components/ui/card';
import { ContactsFilter } from '@/components/contacts/ContactsFilter';
import { ContactFilters } from '@/hooks/useContacts';

interface ContactsFiltersCardProps {
  filters: ContactFilters;
  onFilterChange: (filters: ContactFilters) => void;
  availableRoles: string[];
  availableDepartments: string[];
  availableEntities: Array<{id: string, name: string, type: string}>;
}

export const ContactsFiltersCard = ({
  filters,
  onFilterChange,
  availableRoles,
  availableDepartments,
  availableEntities
}: ContactsFiltersCardProps) => {
  return (
    <Card className="p-4">
      <ContactsFilter 
        filters={filters}
        onFilterChange={onFilterChange}
        availableRoles={availableRoles}
        availableDepartments={availableDepartments}
        availableEntities={availableEntities}
      />
    </Card>
  );
};

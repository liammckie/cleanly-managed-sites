
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { ContactRecord } from '@/lib/types';
import { ContactRow } from './ContactRow';

interface ContactsTableProps {
  contacts: ContactRecord[];
  isLoading: boolean;
  availableEntities: Array<{id: string, name: string, type: string}>;
  onEditContact: (contact: ContactRecord) => void;
  onSetPrimary: (contact: ContactRecord) => void;
  onDeleteContact: (id: string) => void;
}

export const ContactsTable = ({ 
  contacts, 
  isLoading, 
  availableEntities, 
  onEditContact, 
  onSetPrimary, 
  onDeleteContact 
}: ContactsTableProps) => {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Details</TableHead>
            <TableHead>Department/Role</TableHead>
            <TableHead>Associated With</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              Loading contacts...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (contacts.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Details</TableHead>
            <TableHead>Department/Role</TableHead>
            <TableHead>Associated With</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No contacts found. Add your first contact to get started.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact Details</TableHead>
          <TableHead>Department/Role</TableHead>
          <TableHead>Associated With</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <ContactRow 
            key={contact.id} 
            contact={contact} 
            availableEntities={availableEntities}
            onEdit={() => onEditContact(contact)}
            onSetPrimary={() => onSetPrimary(contact)}
            onDelete={() => onDeleteContact(contact.id)}
          />
        ))}
      </TableBody>
    </Table>
  );
};

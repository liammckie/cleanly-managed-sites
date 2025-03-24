
import React from 'react';
import { 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContactRecord } from '@/lib/types';
import { 
  Star, 
  Mail, 
  Phone,
  MoreHorizontal,
  Building,
  Store,
  Truck,
  Users,
  Globe
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContactRowProps {
  contact: ContactRecord;
  availableEntities: Array<{id: string, name: string, type: string}>;
  onEdit: () => void;
  onSetPrimary: () => void;
  onDelete: () => void;
}

export const ContactRow = ({ 
  contact, 
  availableEntities, 
  onEdit, 
  onSetPrimary, 
  onDelete 
}: ContactRowProps) => {
  const getEntityName = (contact: ContactRecord) => {
    if (contact.entity_id === 'all_sites') {
      return 'All Sites';
    }
    
    if (contact.entity_id === 'all_clients') {
      return 'All Clients';
    }
    
    const entity = availableEntities.find(e => e.id === contact.entity_id && e.type === contact.entity_type);
    return entity ? entity.name : '';
  };

  const getEntityIcon = (contact: ContactRecord) => {
    if (contact.entity_id === 'all_sites') {
      return <Globe className="h-4 w-4 mr-1" />;
    }
    
    if (contact.entity_id === 'all_clients') {
      return <Globe className="h-4 w-4 mr-1" />;
    }
    
    switch (contact.entity_type) {
      case 'client':
        return <Building className="h-4 w-4 mr-1" />;
      case 'site':
        return <Store className="h-4 w-4 mr-1" />;
      case 'supplier':
        return <Truck className="h-4 w-4 mr-1" />;
      case 'internal':
        return <Users className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {contact.name}
          {contact.is_primary && contact.entity_id !== 'all_sites' && contact.entity_id !== 'all_clients' && (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {contact.email && (
            <div className="flex items-center gap-1 text-sm">
              <Mail className="h-3.5 w-3.5" />
              <span>{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-1 text-sm">
              <Phone className="h-3.5 w-3.5" />
              <span>{contact.phone}</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{contact.role}</span>
          {contact.department && (
            <span className="text-sm text-muted-foreground">
              {contact.department}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {getEntityIcon(contact)}
          <span>
            {getEntityName(contact) || (contact.entity_type === 'internal' ? 'Internal' : '')}
            {contact.entity_id === 'all_sites' && (
              <Badge variant="outline" className="ml-2">Bulk Assignment</Badge>
            )}
            {contact.entity_id === 'all_clients' && (
              <Badge variant="outline" className="ml-2">Bulk Assignment</Badge>
            )}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {contact.entity_type}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              Edit Contact
            </DropdownMenuItem>
            {!contact.is_primary && contact.entity_id && 
             contact.entity_id !== 'all_sites' && 
             contact.entity_id !== 'all_clients' && (
              <DropdownMenuItem onSelect={onSetPrimary}>
                Set as Primary
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-destructive"
              onSelect={onDelete}
            >
              Delete Contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

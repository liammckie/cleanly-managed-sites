
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ContactRecord } from '@/lib/types';
import { contactSchema, ContactFormValues, EntityType, assignmentTypes, AssignmentType } from './contactSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { 
  Building, 
  Store, 
  Truck, 
  Users, 
  Search,
  AlertCircle
} from 'lucide-react';
import { contactsApi } from '@/lib/api/contactsApi';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
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
    setSearchResults([]);
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

  // Perform search for entities
  useEffect(() => {
    const searchEntities = async () => {
      if (searchTerm.length < 2 || entityType === 'internal' || assignmentType !== 'single') return;
      
      setIsSearching(true);
      try {
        const results = await contactsApi.searchEntities(searchTerm, entityType);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching entities:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchEntities();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, entityType, assignmentType]);

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

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'client': return <Building className="h-4 w-4" />;
      case 'site': return <Store className="h-4 w-4" />;
      case 'supplier': return <Truck className="h-4 w-4" />;
      case 'internal': return <Users className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <FormLabel>Associated With</FormLabel>
            <Select
              value={entityType}
              onValueChange={(value: EntityType) => handleEntityTypeChange(value)}
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

          {entityType !== 'internal' && (
            <div className="space-y-2">
              <FormLabel>Assignment Type</FormLabel>
              <RadioGroup 
                defaultValue={assignmentType} 
                value={assignmentType}
                onValueChange={(value: AssignmentType) => handleAssignmentTypeChange(value)}
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
          )}

          {entityType !== 'internal' && assignmentType === 'single' && (
            <div className="space-y-2">
              <FormLabel>Select {entityType}</FormLabel>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search for ${entityType}...`}
                  className="pl-8"
                />
              </div>
              {searchTerm.length > 0 && (
                <div className="border rounded-md max-h-48 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <div
                        key={result.id}
                        className={`p-2 cursor-pointer hover:bg-accent flex items-center ${entityId === result.id ? 'bg-muted' : ''}`}
                        onClick={() => {
                          setEntityId(result.id);
                          setSearchTerm(result.name);
                        }}
                      >
                        {getEntityIcon(result.type)}
                        <div className="ml-2">
                          <div>{result.name}</div>
                          {result.identifier && (
                            <div className="text-xs text-muted-foreground">
                              {result.identifier}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      No results found. Please try a different search term.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {entityType !== 'internal' && assignmentType !== 'single' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This contact will be associated with {assignmentType === 'all_sites' ? 'all sites' : 'all clients'}.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Contact name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="Contact role" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="Department (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email address" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {entityType !== 'internal' && assignmentType === 'single' && (
          <FormField
            control={form.control}
            name="is_primary"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Primary Contact</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Set this as the primary contact for this {entityType}
                  </p>
                </div>
              </FormItem>
            )}
          />
        )}
        
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
  );
}

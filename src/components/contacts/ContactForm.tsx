
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ContactRecord } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContacts } from '@/hooks/useContacts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Loader2 } from 'lucide-react';
import { CommandInput, CommandGroup, CommandItem, CommandList, Command } from '@/components/ui/command';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  department: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  is_primary: z.boolean().optional(),
  entity_type: z.union([
    z.literal('client'),
    z.literal('site'),
    z.literal('supplier'),
    z.literal('internal')
  ]).optional(),
  entity_id: z.string().optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  contact?: ContactRecord;
  entityType?: string;
  entityId?: string;
  onSubmit: (data: Partial<ContactRecord>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ContactForm({
  contact,
  entityType,
  entityId,
  onSubmit,
  onCancel,
  isSubmitting = false
}: ContactFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const { searchEntities } = useContacts();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: contact?.name || '',
      role: contact?.role || '',
      department: contact?.department || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      notes: contact?.notes || '',
      is_primary: contact?.is_primary || false,
      entity_type: (contact?.entity_type as 'client' | 'site' | 'supplier' | 'internal') || 
                  (entityType as 'client' | 'site' | 'supplier' | 'internal') || 
                  'client',
      entity_id: contact?.entity_id || entityId || '',
    },
  });

  useEffect(() => {
    // Update form when entityId or entityType props change
    if (entityId && entityType) {
      form.setValue('entity_id', entityId);
      form.setValue('entity_type', entityType as any);
    }
  }, [entityId, entityType, form]);

  const handleSubmit = (data: ContactFormValues) => {
    const contactData: Partial<ContactRecord> = {
      ...data,
      entity_type: data.entity_type as 'client' | 'site' | 'supplier' | 'internal',
    };
    onSubmit(contactData);
  };

  const searchForEntities = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const selectedEntityType = form.getValues('entity_type');
      const results = await searchEntities(query, selectedEntityType);
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Error searching entities:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    searchForEntities(value);
  };

  const selectEntity = (entity: any) => {
    form.setValue('entity_id', entity.id);
    form.setValue('entity_type', entity.type as any);
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                  <Input placeholder="Facility Manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="Maintenance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="entity_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value as 'client' | 'site' | 'supplier' | 'internal');
                    form.setValue('entity_id', ''); // Reset entity_id when type changes
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contact type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="entity_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link to Entity</FormLabel>
                <div className="flex space-x-2">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        type="button"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        {field.value ? "Entity Selected" : "Search for entity..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start" side="bottom" avoidCollisions={false} style={{ width: '300px' }}>
                      <Command>
                        <CommandInput
                          placeholder="Search by name..." 
                          value={searchQuery}
                          onValueChange={handleSearch}
                        />
                        <CommandList>
                          {isSearching ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            <>
                              {searchResults && searchResults.length > 0 ? (
                                <CommandGroup>
                                  {searchResults.map((entity) => (
                                    <CommandItem
                                      key={`${entity.type}-${entity.id}`}
                                      value={entity.id}
                                      onSelect={() => selectEntity(entity)}
                                    >
                                      <div className="flex flex-col">
                                        <span>{entity.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)} 
                                          {entity.identifier ? ` • ${entity.identifier}` : ''}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              ) : searchQuery.length > 0 ? (
                                <div className="py-6 text-center text-sm">No results found.</div>
                              ) : (
                                <div className="py-6 text-center text-sm">Type at least 2 characters to search</div>
                              )}
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="hidden"
                    {...field}
                  />
                </div>
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
                <Textarea placeholder="Additional information about this contact" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_primary"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Primary Contact</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Set this as the primary contact for this entity
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (contact ? 'Update Contact' : 'Add Contact')}
          </Button>
        </div>
      </form>
    </Form>
  );
}

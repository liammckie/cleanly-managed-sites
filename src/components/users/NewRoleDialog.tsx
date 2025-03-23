
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateRole } from '@/hooks/useUserRoles';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// All available permissions in the system
const availablePermissions = [
  { id: 'users:read', label: 'View Users' },
  { id: 'users:write', label: 'Create/Edit Users' },
  { id: 'users:manage', label: 'Manage Users (Including Delete)' },
  { id: 'roles:read', label: 'View Roles' },
  { id: 'roles:write', label: 'Create/Edit Roles' },
  { id: 'roles:manage', label: 'Manage Roles (Including Delete)' },
  { id: 'sites:read', label: 'View Sites' },
  { id: 'sites:write', label: 'Create/Edit Sites' },
  { id: 'sites:manage', label: 'Manage Sites (Including Delete)' },
  { id: 'clients:read', label: 'View Clients' },
  { id: 'clients:write', label: 'Create/Edit Clients' },
  { id: 'clients:manage', label: 'Manage Clients (Including Delete)' },
  { id: 'contractors:read', label: 'View Contractors' },
  { id: 'contractors:write', label: 'Create/Edit Contractors' },
  { id: 'contractors:manage', label: 'Manage Contractors (Including Delete)' },
  { id: 'work_orders:read', label: 'View Work Orders' },
  { id: 'work_orders:write', label: 'Create/Edit Work Orders' },
  { id: 'work_orders:manage', label: 'Manage Work Orders (Including Delete)' },
  { id: 'settings:read', label: 'View Settings' },
  { id: 'settings:write', label: 'Edit Settings' },
  { id: 'reports:access', label: 'Access Reports' },
];

const formSchema = z.object({
  name: z.string().min(2, { message: 'Role name must be at least 2 characters' }),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, { message: 'Select at least one permission' }),
});

type FormData = z.infer<typeof formSchema>;

interface NewRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewRoleDialog({ open, onOpenChange }: NewRoleDialogProps) {
  const { createRole, isLoading } = useCreateRole();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createRole({
        name: data.name,
        permissions: data.permissions,
        description: data.description,
      });
      
      toast.success('Role created successfully');
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to create role: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Define a new role with specific permissions.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Site Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the purpose of this role..."
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional. Helps users understand the purpose of this role.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Permissions</FormLabel>
              <FormDescription className="mb-4">
                Select the permissions that this role should have.
              </FormDescription>
              
              <div className="space-y-1 max-h-60 overflow-y-auto p-2 border rounded-md">
                {availablePermissions.map((permission) => (
                  <FormField
                    key={permission.id}
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                      <FormItem
                        key={permission.id}
                        className="flex flex-row items-start space-x-3 space-y-0 py-1"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(permission.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, permission.id]);
                              } else {
                                field.onChange(
                                  field.value.filter((p) => p !== permission.id)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {permission.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              {form.formState.errors.permissions && (
                <FormMessage>
                  {form.formState.errors.permissions.message}
                </FormMessage>
              )}
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

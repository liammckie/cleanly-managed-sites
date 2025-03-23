
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRole, useUpdateRole } from '@/hooks/useUserRoles';
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
import { PERMISSIONS, PermissionId, PermissionsMap } from '@/types/permissions';

// Group permissions by category
const dataPermissions = PERMISSIONS.filter(p => p.category === 'data');
const managementPermissions = PERMISSIONS.filter(p => p.category === 'management');
const adminPermissions = PERMISSIONS.filter(p => p.category === 'admin');

const formSchema = z.object({
  name: z.string().min(2, { message: 'Role name must be at least 2 characters' }),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, { message: 'Select at least one permission' }),
});

type FormData = z.infer<typeof formSchema>;

interface EditRoleDialogProps {
  roleId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRoleDialog({ roleId, open, onOpenChange }: EditRoleDialogProps) {
  const { role } = useRole(roleId || undefined);
  const { updateRole, isLoading } = useUpdateRole();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  // Update form when role changes
  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions,
      });
    }
  }, [role, form]);

  const onSubmit = async (data: FormData) => {
    if (!roleId) return;
    
    try {
      // Convert string array to PermissionsMap
      const permissionsMap: PermissionsMap = {} as PermissionsMap;
      
      // Initialize all permissions to false
      PERMISSIONS.forEach(permission => {
        permissionsMap[permission.id as PermissionId] = false;
      });
      
      // Set selected permissions to true
      data.permissions.forEach(permissionId => {
        permissionsMap[permissionId as PermissionId] = true;
      });
      
      await updateRole(roleId, {
        name: data.name,
        permissions: permissionsMap,
        description: data.description,
      });
      
      toast.success('Role updated successfully');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Failed to update role: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Modify role details and permissions.
          </DialogDescription>
        </DialogHeader>
        
        {role ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Permissions</FormLabel>
                <FormDescription className="mb-4">
                  Select the permissions that this role should have.
                </FormDescription>
                
                <div className="space-y-4 max-h-60 overflow-y-auto p-2 border rounded-md">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Data Management</h3>
                    {dataPermissions.map((permission) => (
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
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal cursor-pointer">
                                {permission.label}
                              </FormLabel>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Management</h3>
                    {managementPermissions.map((permission) => (
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
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal cursor-pointer">
                                {permission.label}
                              </FormLabel>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Admin</h3>
                    {adminPermissions.map((permission) => (
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
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal cursor-pointer">
                                {permission.label}
                              </FormLabel>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
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
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="py-6 text-center">
            <p>Loading role information...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

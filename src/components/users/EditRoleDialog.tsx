import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/lib/types/users';
import { useUpdateRole } from '@/hooks/useUserRoles';
import { PERMISSIONS, PERMISSION_GROUPS } from '@/lib/permissions';

interface EditRoleDialogProps {
  role: UserRole | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditRoleDialog = ({ role, isOpen, onClose, onSave }: EditRoleDialogProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { updateRole } = useUpdateRole();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description || '',
      });

      // Convert permissions array to a map for easier checkbox handling
      const permissionsMap: Record<string, boolean> = {};
      role.permissions.forEach(permission => {
        permissionsMap[permission] = true;
      });
      setSelectedPermissions(permissionsMap);
    }
  }, [role, form]);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const newPermissions = { ...prev };
      if (checked) {
        newPermissions[permission] = true;
      } else {
        delete newPermissions[permission];
      }
      return newPermissions;
    });
  };

  const handleSubmit = async (data: FormValues) => {
    if (!role) return;
    
    try {
      setIsLoading(true);
      
      // Convert the permissions map to an array of strings
      const permissionsArray = Object.keys(selectedPermissions);
      
      await updateRole({
        roleId: role.id,
        data: {
          name: data.name,
          description: data.description,
          permissions: permissionsArray // This is correctly typed now
        }
      });
      
      toast.success('Role updated successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role: {role?.name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter role name" />
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
                      placeholder="Enter role description"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label>Permissions</Label>
              
              {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => (
                <div key={groupKey} className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">{group.label}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {group.permissions.map(permissionKey => {
                      const permission = PERMISSIONS[permissionKey];
                      return (
                        <div key={permissionKey} className="flex items-start space-x-2">
                          <Checkbox
                            id={`permission-${permissionKey}`}
                            checked={!!selectedPermissions[permissionKey]}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permissionKey, checked === true)
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`permission-${permissionKey}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.label}
                            </label>
                            {permission.description && (
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;

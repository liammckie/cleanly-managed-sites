
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/lib/types/users';
import { useUpdateRole, useRole } from '@/hooks/useUserRoles';
import { PERMISSIONS, PERMISSION_GROUPS } from '@/lib/permissions';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditRoleDialogProps {
  roleId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditRoleDialog = ({ roleId, open, onOpenChange }: EditRoleDialogProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});
  const { role, isLoading: isRoleLoading } = useRole(roleId || undefined);
  const { updateRole, isLoading: isUpdating } = useUpdateRole();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
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
    if (!roleId) return;
    
    try {
      // Convert the permissions map to an array of strings
      const permissionsArray = Object.keys(selectedPermissions);
      
      await updateRole({
        roleId,
        data: {
          name: data.name,
          description: data.description,
          permissions: permissionsArray
        }
      });
      
      toast("Role updated successfully", {
        description: `${data.name} role has been updated.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating role:', error);
      toast("Failed to update role", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  if (isRoleLoading) {
    return (
      <Dialog open={open} onOpenChange={open => !open && onOpenChange(false)}>
        <DialogContent>
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={open => !open && onOpenChange(false)}>
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
              <FormLabel>Permissions</FormLabel>
              
              <ScrollArea className="h-72 rounded-md border p-4">
                {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => (
                  <div key={groupKey} className="mb-4">
                    <h3 className="font-medium mb-2">{group.label}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {group.permissions.map((permKey) => {
                        const permission = PERMISSIONS[permKey as keyof typeof PERMISSIONS];
                        return (
                          <div key={permKey} className="flex items-start space-x-2">
                            <Checkbox
                              id={`permission-${permKey}`}
                              checked={!!selectedPermissions[permKey]}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permKey, checked === true)
                              }
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={`permission-${permKey}`}
                                className="text-sm font-medium leading-none"
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
              </ScrollArea>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

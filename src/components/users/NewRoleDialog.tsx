import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCreateRole } from '@/hooks/useUserRoles';

interface NewRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const permissionOptions = [
  "clients.read",
  "clients.write",
  "sites.read",
  "sites.write",
  "contractors.read",
  "contractors.write",
  "users.read",
  "users.write",
  "roles.read",
  "roles.write",
  "quotes.read",
  "quotes.write",
  "workorders.read",
  "workorders.write",
  "billing.read",
  "billing.write",
  "reports.read",
  "reports.write",
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Role name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

interface FormValues {
  name: string;
  description?: string;
}

const NewRoleDialog = ({ isOpen, onClose, onSave }: NewRoleDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const { createRole } = useCreateRole();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

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
    try {
      setIsLoading(true);
      
      // Convert the permissions map to an array of strings
      const permissionsArray = Object.keys(selectedPermissions);
      
      await createRole({
        name: data.name,
        description: data.description,
        permissions: permissionsArray // This is correctly typed now
      });
      
      toast.success('Role created successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Role</AlertDialogTitle>
          <AlertDialogDescription>
            Define a new user role with specific permissions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Admin" {...field} />
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
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Permissions</FormLabel>
              <FormDescription>
                Select permissions for this role.
              </FormDescription>
              <ScrollArea className="rounded-md border p-4 h-48">
                <div className="grid gap-2">
                  {permissionOptions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={!!selectedPermissions[permission]}
                        onCheckedChange={(checked) => handlePermissionChange(permission, !!checked)}
                      />
                      <Label htmlFor={permission} className="capitalize">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewRoleDialog;


import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateRole } from '@/hooks/useUserRoles';
import { PERMISSIONS, PERMISSION_GROUPS } from '@/lib/permissions';

interface NewRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Role name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewRoleDialog = ({ open, onOpenChange }: NewRoleDialogProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});
  const { createRole, isLoading } = useCreateRole();

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
      // Convert the permissions map to an array of strings
      const permissionsArray = Object.keys(selectedPermissions);
      
      await createRole({
        name: data.name,
        description: data.description,
        permissions: permissionsArray
      });
      
      toast("Role created successfully", {
        description: `${data.name} role has been created.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating role:', error);
      toast("Failed to create role", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
        </DialogHeader>
        
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
                    <Textarea placeholder="Role description" {...field} />
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
              <ScrollArea className="h-72 rounded-md border p-4">
                {Object.entries(PERMISSION_GROUPS).map(([key, group]) => (
                  <div key={key} className="mb-4">
                    <h3 className="font-medium mb-2">{group.label}</h3>
                    <div className="grid gap-2">
                      {group.permissions.map((permKey) => (
                        <div key={permKey} className="flex items-start space-x-2">
                          <Checkbox
                            id={`perm-${permKey}`}
                            checked={!!selectedPermissions[permKey]}
                            onCheckedChange={(checked) => handlePermissionChange(permKey, !!checked)}
                          />
                          <div className="grid gap-0.5">
                            <label htmlFor={`perm-${permKey}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {PERMISSIONS[permKey as keyof typeof PERMISSIONS].label}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {PERMISSIONS[permKey as keyof typeof PERMISSIONS].description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRoleDialog;

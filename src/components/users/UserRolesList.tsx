import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UserRole } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import DialogWhenEmpty from '@/components/shared/DialogWhenEmpty';
import { PlusCircledIcon } from '@radix-ui/react-icons';

const roleSchema = z.object({
  name: z.string().min(2, {
    message: "Role name must be at least 2 characters.",
  }),
  description: z.string().optional(),
})

// Convert Json permissions to Record<string, boolean>
const adaptUserRole = (role: any): UserRole => {
  let permissions: Record<string, boolean> = {};
  
  if (role.permissions) {
    // If permissions is a string, try to parse it as JSON
    if (typeof role.permissions === 'string') {
      try {
        permissions = JSON.parse(role.permissions);
      } catch (e) {
        console.error('Error parsing permissions:', e);
        permissions = {};
      }
    } 
    // If permissions is an object, convert it to Record<string, boolean>
    else if (typeof role.permissions === 'object') {
      Object.entries(role.permissions).forEach(([key, value]) => {
        permissions[key] = Boolean(value);
      });
    }
  }
  
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions,
    created_at: role.created_at,
    updated_at: role.updated_at
  };
};

export function UserRolesList() {
  const [open, setOpen] = React.useState(false)
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const calculatedValues = {
    totalRoles: roles.length,
    activeRoles: roles.filter(role => role.name).length,
  }

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*');
      
        if (error) throw error;
      
        if (data) {
          // Convert roles to the correct type
          const adaptedRoles = data.map(adaptUserRole);
          setRoles(adaptedRoles);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Failed to load user roles');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoles();
  }, [supabase]);

  // Create a new role with the correct permissions type
  const handleCreateRole = async (role: Pick<UserRole, 'name' | 'description'>) => {
    setIsCreating(true);
    try {
      const newRole = {
        name: role.name,
        description: role.description || '',
        permissions: {} as Record<string, boolean>
      };
      
      const { data, error } = await supabase
        .from('user_roles')
        .insert(newRole)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Convert to the correct type
        const adaptedRole = adaptUserRole(data);
        setRoles(prev => [...prev, adaptedRole]);
        toast.success(`Role "${role.name}" created successfully`);
      }
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role');
    } finally {
      setIsCreating(false);
    }
  };

  function onSubmit(values: z.infer<typeof roleSchema>) {
    handleCreateRole(values);
    setOpen(false);
  }

  return (
    <div>
      <div className="md:flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">User Roles</h2>
        <Button onClick={() => setOpen(true)}>
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      {isLoading ? (
        <p>Loading user roles...</p>
      ) : roles.length === 0 ? (
        <DialogWhenEmpty
          title="No User Roles"
          description="Looks like you haven't created any user roles yet. Create one to get started."
          isVisible={!isLoading && roles.length === 0}
          onAction={() => setOpen(true)}
          buttonText="Create First Role"
          icon={<PlusCircledIcon className="h-6 w-6 text-muted-foreground" />}
        />
      ) : (
        <Table>
          <TableCaption>A list of your user roles.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add User Role</DialogTitle>
            <DialogDescription>
              Create a new role to manage user permissions.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Administrator" {...field} />
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
                      <Input placeholder="e.g. Full access to all features" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Role'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

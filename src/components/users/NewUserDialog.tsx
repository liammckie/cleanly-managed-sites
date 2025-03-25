
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateUser } from '@/hooks/useUsers';
import { Loader2 } from 'lucide-react';

const userSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  role: z.string().min(1, 'Role is required'),
  phone: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface NewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: () => void;
}

export function NewUserDialog({ open, onOpenChange, onUserCreated }: NewUserDialogProps) {
  const { createUser, isCreating } = useCreateUser();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: 'user',
      phone: '',
    },
  });
  
  const onSubmit = async (data: UserFormValues) => {
    try {
      await createUser({
        ...data,
        status: 'active',
      });
      
      form.reset();
      onOpenChange(false);
      if (onUserCreated) onUserCreated();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                {...form.register('first_name')}
                className={form.formState.errors.first_name ? "border-destructive" : ""}
              />
              {form.formState.errors.first_name && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.first_name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                {...form.register('last_name')}
                className={form.formState.errors.last_name ? "border-destructive" : ""}
              />
              {form.formState.errors.last_name && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.last_name.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              className={form.formState.errors.email ? "border-destructive" : ""}
            />
            {form.formState.errors.email && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              {...form.register('role')}
              className="w-full p-2 border rounded-md"
            >
              <option value="user">User</option>
              <option value="admin">Administrator</option>
              <option value="manager">Manager</option>
            </select>
            {form.formState.errors.role && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.role.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              {...form.register('phone')}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

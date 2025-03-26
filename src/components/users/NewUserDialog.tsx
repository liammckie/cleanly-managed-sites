
import React from 'react';
import { useUsers } from '@/hooks/useUsers';
import { SystemUser } from '@/lib/types/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewUserDialog({ open, onOpenChange }: NewUserDialogProps) {
  const { createUser } = useUsers();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      title: '',
    }
  });
  
  const [isCreating, setIsCreating] = React.useState(false);
  
  const onSubmit = async (data: any) => {
    try {
      setIsCreating(true);
      // Create the user with role set to default user role
      await createUser({
        status: 'active',
        ...data,
        role: '2', // Set as string for User role ID
        full_name: `${data.first_name} ${data.last_name}`
      } as Partial<SystemUser>);
      
      toast.success('User created successfully');
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block" htmlFor="first_name">
                  First Name
                </label>
                <Input
                  id="first_name"
                  {...register('first_name', { required: 'First name is required' })}
                  placeholder="John"
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500 mt-1">{errors.first_name.message}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block" htmlFor="last_name">
                  Last Name
                </label>
                <Input
                  id="last_name"
                  {...register('last_name', { required: 'Last name is required' })}
                  placeholder="Doe"
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500 mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="john.doe@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="phone">
                Phone (optional)
              </label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="title">
                Job Title (optional)
              </label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Manager"
              />
            </div>
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

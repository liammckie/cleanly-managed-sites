
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { SystemUserInsert } from '@/lib/api/users';
import { SystemUserRole } from '@/lib/types/users';

interface NewUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SystemUserInsert) => void;
  roles: SystemUserRole[];
  isSubmitting?: boolean;
}

export function NewUserDialog({ open, onClose, onSubmit, roles, isSubmitting = false }: NewUserDialogProps) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      title: '',
      roleId: '',
      password: ''
    }
  });
  
  const handleFormSubmit = (data: any) => {
    // Convert the form data to match the SystemUserInsert type
    const userData: SystemUserInsert = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      title: data.title,
      role_id: data.roleId,
      status: 'active',
      full_name: `${data.firstName} ${data.lastName}`,
      password: data.password
    };
    
    onSubmit(userData);
  };
  
  const onDialogClose = () => {
    reset();
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="user@example.com"
                {...register('email', { required: true })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">Email is required</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register('firstName', { required: true })}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">First name is required</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register('lastName', { required: true })}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">Last name is required</p>
                )}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="(555) 555-5555"
                {...register('phone')}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="Manager"
                {...register('title')}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value) => setValue('roleId', value)}
                defaultValue={watch('roleId')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId && (
                <p className="text-sm text-red-500">Role is required</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: true })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">Password is required</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onDialogClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

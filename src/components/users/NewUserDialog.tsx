import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usersApi } from '@/lib/api/users';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRoles } from '@/hooks/useUserRoles';
import { SystemUserRole, SystemUserInsert } from '@/lib/types/users';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface NewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NewUserDialog({ open, onOpenChange, onSuccess }: NewUserDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { roles, isLoading: rolesLoading } = useUserRoles();
  
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<SystemUserInsert>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      title: '',
      role_id: '',
      status: 'active',
      password: ''
    }
  });
  
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  
  React.useEffect(() => {
    if (firstName && lastName) {
      setValue('full_name', `${firstName} ${lastName}`);
    }
  }, [firstName, lastName, setValue]);
  
  const onSubmit = async (data: SystemUserInsert) => {
    setIsLoading(true);
    try {
      await usersApi.createUser(data);
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
      reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" className="col-span-3" type="email" {...register('email', { required: true })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input id="firstName" className="col-span-3" {...register('firstName', { required: true })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input id="lastName" className="col-span-3" {...register('lastName', { required: true })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input id="phone" className="col-span-3" {...register('phone')} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" className="col-span-3" {...register('title')} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select onValueChange={(value) => setValue('role_id', value)} >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {rolesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  roles?.map((role: SystemUserRole) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" className="col-span-3" type="password" {...register('password')} />
          </div>
        </form>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useUserRoles } from '@/hooks/useUserRoles';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Plus,
  Save, 
  X
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { PermissionCheckbox } from '@/components/users/PermissionCheckbox';
import { PERMISSIONS, getPermissionsByCategory, PermissionId, PermissionsMap } from '@/types/permissions';

// Define form schema using zod
const userFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  role_id: z.string().min(1, { message: 'Please select a role' }),
  phone: z.string().optional(),
  custom_id: z.string().optional(),
  note: z.string().optional(),
  status: z.object({
    active: z.boolean().default(true),
    send_activation: z.boolean().default(false),
    daily_summary: z.boolean().default(false)
  }),
  territories: z.array(z.string()).default([]),
  permissions: z.record(z.string(), z.boolean()).optional()
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading, updateUser } = useUser(id);
  const { roles } = useUserRoles();
  const [selectedTerritory, setSelectedTerritory] = useState('');
  const [territories, setTerritories] = useState<string[]>(['All']);
  const [permissions, setPermissions] = useState<PermissionsMap>({} as PermissionsMap);
  const [isRoleLocked, setIsRoleLocked] = useState(true);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      role_id: '',
      phone: '',
      custom_id: '',
      note: '',
      status: {
        active: true,
        send_activation: false,
        daily_summary: false
      },
      territories: ['All'],
      permissions: {}
    }
  });

  useEffect(() => {
    if (user) {
      // Initialize form with user data
      form.reset({
        full_name: user.full_name,
        email: user.email,
        role_id: user.role.id,
        phone: '',
        custom_id: '',
        note: '',
        status: {
          active: user.status === 'active',
          send_activation: false,
          daily_summary: false
        },
        territories: ['All'],
        permissions: {}
      });

      // If role is defined, initialize permissions based on role
      if (user.role && roles) {
        const role = roles.find(r => r.id === user.role.id);
        if (role && role.permissions) {
          const permMap = role.permissions as unknown as PermissionsMap;
          setPermissions(permMap);
        }
      }
    }
  }, [user, roles, form]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      // If role is unlocked, update permissions for this specific user
      const updatedPermissions = isRoleLocked ? undefined : permissions;
      
      await updateUser({
        full_name: data.full_name,
        email: data.email,
        role: roles?.find(r => r.id === data.role_id) || user?.role,
        status: data.status.active ? 'active' : 'inactive',
        phone: data.phone,
        custom_id: data.custom_id,
        note: data.note,
        territories: data.territories,
        permissions: updatedPermissions
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addTerritory = () => {
    if (selectedTerritory && !territories.includes(selectedTerritory)) {
      const newTerritories = [...territories, selectedTerritory];
      setTerritories(newTerritories);
      form.setValue('territories', newTerritories);
      setSelectedTerritory('');
    }
  };

  const removeTerritory = (territory: string) => {
    const newTerritories = territories.filter(t => t !== territory);
    setTerritories(newTerritories);
    form.setValue('territories', newTerritories);
  };

  const handlePermissionChange = (permissionId: PermissionId, checked: boolean | "indeterminate") => {
    setPermissions(prev => ({
      ...prev,
      [permissionId]: checked === true
    }));
  };

  // Handle role change
  const handleRoleChange = (roleId: string) => {
    form.setValue('role_id', roleId);
    
    // Update permissions based on role
    if (roles) {
      const role = roles.find(r => r.id === roleId);
      if (role && role.permissions) {
        const permMap = role.permissions as unknown as PermissionsMap;
        setPermissions(permMap);
      }
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container px-4 py-6 mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded-md w-1/4"></div>
            <div className="h-32 bg-muted rounded-md w-full"></div>
            <div className="h-64 bg-muted rounded-md w-full"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="container px-4 py-6 mx-auto">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
            <p className="mb-4">The user you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate('/users')}>
              Back to Users
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/users')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{user.full_name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user.avatar_url} alt={user.full_name} />
                          <AvatarFallback className="text-xl">
                            {user.full_name.split(' ').map(name => name[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email*</FormLabel>
                          <FormControl>
                            <Input placeholder="Email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Custom ID */}
                    <FormField
                      control={form.control}
                      name="custom_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter ID" {...field} />
                          </FormControl>
                          <FormDescription>
                            If blank, an ID will be generated
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Role */}
                    <FormField
                      control={form.control}
                      name="role_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role*</FormLabel>
                          <Select 
                            onValueChange={val => handleRoleChange(val)} 
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles?.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Territory */}
                    <FormItem>
                      <FormLabel>Territory*</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Input 
                          placeholder="Enter territory" 
                          value={selectedTerritory}
                          onChange={(e) => setSelectedTerritory(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          onClick={addTerritory} 
                          variant="secondary"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {territories.map((territory) => (
                          <div 
                            key={territory} 
                            className="flex items-center bg-muted px-2 py-1 rounded-md text-sm"
                          >
                            {territory}
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 ml-1"
                              onClick={() => removeTerritory(territory)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <FormDescription>
                        Users cannot see activities and places outside their assigned territories on mobile and web.
                      </FormDescription>
                    </FormItem>
                    
                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Note */}
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-2">Note</h3>
                      <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                placeholder="Add a note" 
                                className="min-h-32" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="status.active"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div>
                            <FormLabel>Active user</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status.send_activation"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div>
                            <FormLabel>Send activation email</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status.daily_summary"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div>
                            <FormLabel>Use daily summary email</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Admin permissions</CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="override-role"
                    checked={!isRoleLocked}
                    onCheckedChange={(checked) => setIsRoleLocked(!checked)}
                  />
                  <label htmlFor="override-role" className="text-sm cursor-pointer">
                    Override role
                  </label>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Data Management</h3>
                    {getPermissionsByCategory('data').map((permission) => (
                      <PermissionCheckbox 
                        key={permission.id}
                        id={permission.id}
                        label={permission.label}
                        description={permission.description}
                        checked={permissions[permission.id]}
                        onCheckedChange={checked => handlePermissionChange(permission.id, checked)}
                      />
                    ))}
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Management</h3>
                    {getPermissionsByCategory('management').map((permission) => (
                      <PermissionCheckbox 
                        key={permission.id}
                        id={permission.id}
                        label={permission.label}
                        description={permission.description}
                        checked={permissions[permission.id]}
                        onCheckedChange={checked => handlePermissionChange(permission.id, checked)}
                      />
                    ))}
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Admin</h3>
                    {getPermissionsByCategory('admin').map((permission) => (
                      <PermissionCheckbox 
                        key={permission.id}
                        id={permission.id}
                        label={permission.label}
                        description={permission.description}
                        checked={permissions[permission.id]}
                        onCheckedChange={checked => handlePermissionChange(permission.id, checked)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UserDetail;

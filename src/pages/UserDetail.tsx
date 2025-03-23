
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useUserRoles } from '@/hooks/useUserRoles';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  User, 
  Mail, 
  Phone, 
  Shield, 
  MapPin,
  Save, 
  Plus,
  X
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

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
  territories: z.array(z.string()).default([])
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading, updateUser } = useUser(id);
  const { roles } = useUserRoles();
  const [selectedTerritory, setSelectedTerritory] = useState('');
  const [territories, setTerritories] = useState<string[]>(['All']);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      role_id: user?.role.id || '',
      phone: '',
      custom_id: '',
      note: '',
      status: {
        active: user?.status === 'active',
        send_activation: false,
        daily_summary: false
      },
      territories: ['All']
    }
  });

  React.useEffect(() => {
    if (user) {
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
        territories: ['All']
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      await updateUser({
        full_name: data.full_name,
        email: data.email,
        role: roles?.find(r => r.id === data.role_id) || user?.role,
        status: data.status.active ? 'active' : 'inactive'
      });
      
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
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
                          <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
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
                <div className="space-y-4">
                  <Form {...form}>
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
                  </Form>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Admin permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="data-admin" checked={true} />
                      <label htmlFor="data-admin" className="text-sm font-medium">
                        Data Administration
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="places" checked={true} />
                      <label htmlFor="places" className="text-sm font-medium">
                        Places
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="products" checked={true} />
                      <label htmlFor="products" className="text-sm font-medium">
                        Products
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="files" checked={true} />
                      <label htmlFor="files" className="text-sm font-medium">
                        Files
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pricelists" checked={true} />
                      <label htmlFor="pricelists" className="text-sm font-medium">
                        Pricelists
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="forms" checked={true} />
                      <label htmlFor="forms" className="text-sm font-medium">
                        Forms
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="schedule" checked={true} />
                      <label htmlFor="schedule" className="text-sm font-medium">
                        Schedule
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="statuses" checked={true} />
                      <label htmlFor="statuses" className="text-sm font-medium">
                        Statuses
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="audits" checked={true} />
                      <label htmlFor="audits" className="text-sm font-medium">
                        Audits
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tags" checked={true} />
                      <label htmlFor="tags" className="text-sm font-medium">
                        Tags
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="app-settings" checked={true} />
                      <label htmlFor="app-settings" className="text-sm font-medium">
                        Application settings
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="data-analysis" checked={true} />
                      <label htmlFor="data-analysis" className="text-sm font-medium">
                        Data analysis
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="exports" checked={true} />
                      <label htmlFor="exports" className="text-sm font-medium">
                        Exports
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="public-link" checked={true} />
                      <label htmlFor="public-link" className="text-sm font-medium">
                        Public link
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="manage-org" />
                      <label htmlFor="manage-org" className="text-sm font-medium">
                        Manage Organization
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="representatives" />
                      <label htmlFor="representatives" className="text-sm font-medium">
                        Representatives
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="home-address" />
                      <label htmlFor="home-address" className="text-sm font-medium">
                        Home address
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="admins" />
                      <label htmlFor="admins" className="text-sm font-medium">
                        Admins
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="territories" />
                      <label htmlFor="territories" className="text-sm font-medium">
                        Territories
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="company-info" />
                      <label htmlFor="company-info" className="text-sm font-medium">
                        Company info
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="third-party" />
                      <label htmlFor="third-party" className="text-sm font-medium">
                        3rd party users
                      </label>
                    </div>
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

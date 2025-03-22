
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useContractors } from '@/hooks/useContractors';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { ContractorVersionHistory } from './ContractorVersionHistory';
import { useContractorVersionHistory } from '@/hooks/useContractorVersionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2 } from 'lucide-react';

// Define form validation schema
const contractorFormSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  contact_name: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
  contractor_type: z.string().min(1, 'Contractor type is required'),
  hourly_rate: z.string().optional(),
  day_rate: z.string().optional(),
  abn: z.string().optional(),
  tax_id: z.string().optional(),
  notes: z.string().optional(),
  specialty: z.array(z.string()).optional(),
});

type ContractorFormValues = z.infer<typeof contractorFormSchema>;

type ContractorFormProps = {
  mode?: 'create' | 'edit';
  contractor?: any;
};

export const ContractorForm = ({ mode = 'create', contractor }: ContractorFormProps) => {
  const navigate = useNavigate();
  const { createContractor, updateContractor, deleteContractor } = useContractors();
  const { history, isLoading: isLoadingHistory } = useContractorVersionHistory(
    mode === 'edit' && contractor ? contractor.id : null
  );

  // Define specialty options
  const specialtyOptions = [
    { id: 'cleaning', label: 'Cleaning' },
    { id: 'gardening', label: 'Gardening' },
    { id: 'security', label: 'Security' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'pest_control', label: 'Pest Control' },
    { id: 'electrical', label: 'Electrical' },
    { id: 'plumbing', label: 'Plumbing' },
    { id: 'carpentry', label: 'Carpentry' },
  ];

  // Form initialization
  const form = useForm<ContractorFormValues>({
    resolver: zodResolver(contractorFormSchema),
    defaultValues: {
      business_name: contractor?.business_name || '',
      contact_name: contractor?.contact_name || '',
      email: contractor?.email || '',
      phone: contractor?.phone || '',
      address: contractor?.address || '',
      city: contractor?.city || '',
      state: contractor?.state || '',
      postcode: contractor?.postcode || '',
      status: contractor?.status || 'active',
      contractor_type: contractor?.contractor_type || 'service_provider',
      hourly_rate: contractor?.hourly_rate ? String(contractor.hourly_rate) : '',
      day_rate: contractor?.day_rate ? String(contractor.day_rate) : '',
      abn: contractor?.abn || '',
      tax_id: contractor?.tax_id || '',
      notes: contractor?.notes || '',
      specialty: contractor?.specialty || [],
    },
  });

  // Handle form submission
  const onSubmit = async (values: ContractorFormValues) => {
    try {
      // Convert string rates to numbers or null
      const hourlyRate = values.hourly_rate ? parseFloat(values.hourly_rate) : null;
      const dayRate = values.day_rate ? parseFloat(values.day_rate) : null;

      // Prepare contractor data
      const contractorData = {
        business_name: values.business_name, // Required field
        contact_name: values.contact_name, // Required field
        email: values.email || null,
        phone: values.phone || null,
        address: values.address || null,
        city: values.city || null,
        state: values.state || null,
        postcode: values.postcode || null,
        status: values.status, // Required field
        contractor_type: values.contractor_type, // Required field
        hourly_rate: hourlyRate,
        day_rate: dayRate,
        abn: values.abn || null,
        tax_id: values.tax_id || null,
        notes: values.notes || null,
        specialty: values.specialty || null,
        rating: null, // Required field, default to null
      };

      if (mode === 'create') {
        // Create new contractor
        await createContractor(contractorData);
        navigate('/contractors');
      } else if (mode === 'edit' && contractor) {
        // Update existing contractor
        await updateContractor({
          id: contractor.id,
          data: contractorData,
        });
        navigate(`/contractors/${contractor.id}`);
      }
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} contractor:`, error);
    }
  };

  // Handle contractor deletion
  const handleDelete = async () => {
    if (contractor && contractor.id) {
      try {
        await deleteContractor(contractor.id);
        navigate('/contractors');
      } catch (error) {
        console.error('Error deleting contractor:', error);
      }
    }
  };

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList>
        <TabsTrigger value="details">Contractor Details</TabsTrigger>
        {mode === 'edit' && <TabsTrigger value="history">Version History</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="details">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium">Basic Information</h2>
                    
                    <FormField
                      control={form.control}
                      name="business_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter business name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contact_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter contact name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="Enter email address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter phone number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contractor_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contractor Type*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select contractor type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="service_provider">Service Provider</SelectItem>
                              <SelectItem value="supplier">Supplier</SelectItem>
                              <SelectItem value="consultant">Consultant</SelectItem>
                              <SelectItem value="subcontractor">Subcontractor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Address & Financial Details */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium">Address & Financial Details</h2>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter street address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter state" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter postcode" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="hourly_rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate ($)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.01" placeholder="0.00" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="day_rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Day Rate ($)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.01" placeholder="0.00" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="abn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ABN</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter ABN" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tax_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax ID</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter Tax ID" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Specialties Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Specialties</h2>
                  
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {specialtyOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="specialty"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || [];
                                          return checked
                                            ? field.onChange([...currentValue, option.id])
                                            : field.onChange(
                                                currentValue.filter((value) => value !== option.id)
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Notes Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Additional Information</h2>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter any additional notes or information about this contractor"
                            className="h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Form Buttons */}
                <div className="flex justify-between gap-4">
                  {mode === 'edit' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          type="button" 
                          variant="destructive"
                          className="gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the contractor
                            and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <div className="flex ml-auto gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => mode === 'edit' && contractor 
                        ? navigate(`/contractors/${contractor.id}`) 
                        : navigate('/contractors')}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {mode === 'create' ? 'Save Contractor' : 'Update Contractor'}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      {mode === 'edit' && (
        <TabsContent value="history">
          <ContractorVersionHistory 
            history={history || []} 
            isLoading={isLoadingHistory}
            currentContractor={contractor}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};

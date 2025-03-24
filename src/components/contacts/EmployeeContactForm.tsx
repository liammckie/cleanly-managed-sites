
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ContactRecord } from '@/lib/types';
import { employeeSchema, EmployeeFormValues } from './employeeSchema';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Briefcase, FileText, Users, Clock } from 'lucide-react';

export interface EmployeeContactFormProps {
  contact?: ContactRecord;
  onSubmit: (values: Partial<ContactRecord>) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function EmployeeContactForm({
  contact,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EmployeeContactFormProps) {
  const [activeTab, setActiveTab] = useState('personal');

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: contact?.name || '',
      role: contact?.role || '',
      department: contact?.department || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      notes: contact?.notes || '',
      
      // Employee specific fields
      position: '',
      employmentType: 'full-time',
      startDate: undefined,
      employeeId: '',
      reportingTo: '',
      emergencyContactName: '',
      emergencyContactPhone: '',

      // These would come from the extended data if it existed
      ...(contact?.services as any || {}),
    },
  });

  const handleSubmit = async (values: EmployeeFormValues) => {
    try {
      // Convert the form values to a ContactRecord with services field containing the employee data
      const employeeData: Partial<ContactRecord> = {
        name: values.name,
        role: values.role,
        department: values.department,
        email: values.email,
        phone: values.phone,
        notes: values.notes,
        entity_type: 'internal',
        // Store additional employee fields in the services JSON field
        services: {
          position: values.position,
          employmentType: values.employmentType,
          startDate: values.startDate ? values.startDate.toISOString() : undefined,
          employeeId: values.employeeId,
          reportingTo: values.reportingTo,
          emergencyContactName: values.emergencyContactName,
          emergencyContactPhone: values.emergencyContactPhone,
        },
      };
      
      if (contact?.id) {
        employeeData.id = contact.id;
      }
      
      await onSubmit(employeeData);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="employment" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Employment</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
              <TabsTrigger value="leave" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Leave</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Employee name" {...field} />
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
                        <Input placeholder="Email address" type="email" {...field} />
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
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Emergency contact name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Emergency contact phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="employment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Job position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Role" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <DatePicker
                        date={field.value}
                        onSelect={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Employee ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reportingTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporting To</FormLabel>
                      <FormControl>
                        <Input placeholder="Manager/Supervisor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="min-h-[200px] flex items-center justify-center border border-dashed rounded-md p-6">
                <div className="text-center">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium">Document Management</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload and manage employee documents here
                  </p>
                  <Button variant="outline" className="mt-4" disabled>Coming Soon</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leave" className="space-y-4">
              <div className="min-h-[200px] flex items-center justify-center border border-dashed rounded-md p-6">
                <div className="text-center">
                  <Clock className="h-10 w-10 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium">Leave Management</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Track and manage employee leave and time off
                  </p>
                  <Button variant="outline" className="mt-4" disabled>Coming Soon</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about the employee"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (contact ? 'Update Employee' : 'Add Employee')}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}

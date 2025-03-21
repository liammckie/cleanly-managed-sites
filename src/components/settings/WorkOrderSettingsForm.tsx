
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Briefcase, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type WorkOrderSettingsFormValues = {
  requireApproval: boolean;
  defaultDueDays: number;
  defaultDescription: string;
  sendClientNotifications: boolean;
  allowAttachments: boolean;
  requiredFields: string[];
  defaultPriority: string;
};

export const WorkOrderSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<WorkOrderSettingsFormValues>({
    defaultValues: {
      requireApproval: true,
      defaultDueDays: 7,
      defaultDescription: '',
      sendClientNotifications: true,
      allowAttachments: true,
      requiredFields: ['title', 'site_id', 'description'],
      defaultPriority: 'medium'
    }
  });
  
  const onSubmit = async (data: WorkOrderSettingsFormValues) => {
    setIsLoading(true);
    try {
      // In a real implementation, you would save these settings
      // to your database, perhaps using Supabase
      
      console.log('Saving work order settings:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Work order settings updated successfully');
    } catch (error) {
      console.error('Failed to update work order settings:', error);
      toast.error('Failed to update work order settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Work Order Settings
        </CardTitle>
        <CardDescription>
          Configure default settings for work orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Default Values</h3>
                
                <FormField
                  control={form.control}
                  name="defaultPriority"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Default Priority</FormLabel>
                      <FormControl>
                        <ToggleGroup 
                          type="single" 
                          value={field.value} 
                          onValueChange={field.onChange}
                          className="justify-start"
                        >
                          <ToggleGroupItem value="low">Low</ToggleGroupItem>
                          <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
                          <ToggleGroupItem value="high">High</ToggleGroupItem>
                          <ToggleGroupItem value="urgent">Urgent</ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="defaultDueDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Due Days</FormLabel>
                      <FormDescription>
                        Number of days from creation date to set as the default due date
                      </FormDescription>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="defaultDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Description Template</FormLabel>
                      <FormDescription>
                        Template text to use for new work orders
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Enter default description template..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Work Order Requirements
                </h3>
                
                <FormField
                  control={form.control}
                  name="requiredFields"
                  render={() => (
                    <FormItem>
                      <FormLabel>Required Fields</FormLabel>
                      <FormDescription>
                        Select which fields are required when creating a work order
                      </FormDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <FormField
                          control={form.control}
                          name="requiredFields"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('title')}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = checked 
                                      ? [...field.value, 'title'] 
                                      : field.value.filter(value => value !== 'title');
                                    field.onChange(updatedFields);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Title</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="requiredFields"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('description')}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = checked 
                                      ? [...field.value, 'description'] 
                                      : field.value.filter(value => value !== 'description');
                                    field.onChange(updatedFields);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Description</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="requiredFields"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('site_id')}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = checked 
                                      ? [...field.value, 'site_id'] 
                                      : field.value.filter(value => value !== 'site_id');
                                    field.onChange(updatedFields);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Site</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="requiredFields"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('due_date')}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = checked 
                                      ? [...field.value, 'due_date'] 
                                      : field.value.filter(value => value !== 'due_date');
                                    field.onChange(updatedFields);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Due Date</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="requiredFields"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('priority')}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = checked 
                                      ? [...field.value, 'priority'] 
                                      : field.value.filter(value => value !== 'priority');
                                    field.onChange(updatedFields);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Priority</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="requiredFields"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes('assigned_to')}
                                  onCheckedChange={(checked) => {
                                    const updatedFields = checked 
                                      ? [...field.value, 'assigned_to'] 
                                      : field.value.filter(value => value !== 'assigned_to');
                                    field.onChange(updatedFields);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Assigned To</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Work Order Behavior</h3>
                
                <FormField
                  control={form.control}
                  name="requireApproval"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Require Approval</FormLabel>
                        <FormDescription>
                          Work orders require approval before being marked as complete
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sendClientNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Client Notifications</FormLabel>
                        <FormDescription>
                          Send email notifications to clients when work orders are created or updated
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="allowAttachments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Allow Attachments</FormLabel>
                        <FormDescription>
                          Enable file attachments on work orders
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

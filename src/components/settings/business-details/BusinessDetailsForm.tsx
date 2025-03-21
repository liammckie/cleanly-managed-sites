
import React from 'react';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Building2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { LogoUpload } from './LogoUpload';
import { BusinessInfoFields } from './BusinessInfoFields';
import { AddressFields } from './AddressFields';
import { ContactFields } from './ContactFields';
import { SocialMediaFields } from './SocialMediaFields';
import { BusinessFormValues, mapBusinessDetailsToFormValues } from './types';

// Form validation schema
const businessFormSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  tax_id: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  business_hours: z.string().optional(),
  social_media: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional()
  }).optional()
});

export const BusinessDetailsForm = () => {
  const { 
    businessDetails, 
    isLoading, 
    isUploading,
    updateBusinessDetails, 
    uploadLogo 
  } = useBusinessDetails();
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: mapBusinessDetailsToFormValues(businessDetails)
  });
  
  // Update form values when business details are loaded
  React.useEffect(() => {
    if (businessDetails) {
      form.reset(mapBusinessDetailsToFormValues(businessDetails));
    }
  }, [businessDetails, form]);
  
  const onSubmit = async (data: BusinessFormValues) => {
    try {
      await updateBusinessDetails(data);
      toast.success('Business details updated successfully');
    } catch (error) {
      console.error('Error updating business details:', error);
      toast.error('Failed to update business details');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          My Business Details
        </CardTitle>
        <CardDescription>
          Update your business information and logo. This information will appear on invoices, reports, and client communications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
          {/* Logo Section */}
          <LogoUpload 
            logoUrl={businessDetails?.logo_url || null}
            isUploading={isUploading}
            onUpload={uploadLogo}
          />
          
          {/* Form Section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BusinessInfoFields form={form} />
              
              <Separator className="my-4" />
              
              <AddressFields form={form} />
              
              <Separator className="my-4" />
              
              <ContactFields form={form} />
              
              <Separator className="my-4" />
              
              <FormField
                control={form.control}
                name="social_media"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base">Social Media</FormLabel>
                    <SocialMediaFields form={form} />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="mt-4"
                  disabled={form.formState.isSubmitting || isUploading}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Details
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
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
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Upload, Save, Building2, AlertCircle, Info } from 'lucide-react';
import { isImageFile } from '@/lib/fileUtils';
import { toast } from 'sonner';

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

type BusinessFormValues = z.infer<typeof businessFormSchema>;

export const BusinessDetailsForm = () => {
  const { 
    businessDetails, 
    isLoading, 
    isUploading,
    updateBusinessDetails, 
    uploadLogo 
  } = useBusinessDetails();
  
  const [logoPreview, setLogoPreview] = useState<string | null>(businessDetails?.logo_url || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: businessDetails?.name || '',
      address: businessDetails?.address || '',
      city: businessDetails?.city || '',
      state: businessDetails?.state || '',
      postcode: businessDetails?.postcode || '',
      phone: businessDetails?.phone || '',
      email: businessDetails?.email || '',
      website: businessDetails?.website || '',
      tax_id: businessDetails?.tax_id || '',
      industry: businessDetails?.industry || '',
      description: businessDetails?.description || '',
      business_hours: businessDetails?.business_hours || '',
      social_media: businessDetails?.social_media || {
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: ''
      }
    }
  });
  
  // Update form values when business details are loaded
  React.useEffect(() => {
    if (businessDetails) {
      form.reset({
        name: businessDetails.name || '',
        address: businessDetails.address || '',
        city: businessDetails.city || '',
        state: businessDetails.state || '',
        postcode: businessDetails.postcode || '',
        phone: businessDetails.phone || '',
        email: businessDetails.email || '',
        website: businessDetails.website || '',
        tax_id: businessDetails.tax_id || '',
        industry: businessDetails.industry || '',
        description: businessDetails.description || '',
        business_hours: businessDetails.business_hours || '',
        social_media: businessDetails.social_media || {
          facebook: '',
          instagram: '',
          linkedin: '',
          twitter: ''
        }
      });
      
      setLogoPreview(businessDetails.logo_url || null);
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
  
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);
    
    if (!file) return;
    
    // Validate file type
    if (!isImageFile(file.name)) {
      setUploadError('Please upload an image file (jpg, png, gif, etc.)');
      toast.error('Invalid file type. Please upload an image.');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit');
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    try {
      // Upload the file
      await uploadLogo(file);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploadError('Failed to upload logo');
      toast.error('Failed to upload logo');
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
          <div className="flex flex-col items-center gap-4">
            <div className="border rounded-lg overflow-hidden w-full aspect-square flex items-center justify-center bg-muted relative">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Business Logo" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Building2 className="h-20 w-20 text-muted-foreground/40" />
              )}
            </div>
            
            <div className="w-full">
              <label 
                htmlFor="logo-upload" 
                className="cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2 w-full">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </>
                    )}
                  </Button>
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                />
              </label>
              
              {uploadError && (
                <div className="text-xs text-destructive mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {uploadError}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Recommended: Square image, 512x512px or larger (max 5MB)
              </p>
            </div>
          </div>
          
          {/* Form Section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Business Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The official registered name of your business
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of your business" {...field} />
                    </FormControl>
                    <FormDescription>
                      A short description of your business services
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="Your industry" {...field} />
                    </FormControl>
                    <FormDescription>
                      The primary industry your business operates in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Business St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
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
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormDescription>
                        Primary business contact number
                      </FormDescription>
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
                        <Input placeholder="contact@yourbusiness.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Primary business contact email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.yourbusiness.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Include https:// prefix
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID / ABN</FormLabel>
                      <FormControl>
                        <Input placeholder="Tax ID or ABN" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your business tax identification number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="business_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Hours</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon-Fri: 9am-5pm" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your standard operating hours
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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

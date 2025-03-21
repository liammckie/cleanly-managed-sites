
import React, { useState } from 'react';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Upload, Save, Building2, AlertCircle } from 'lucide-react';
import { isImageFile } from '@/lib/fileUtils';

type BusinessFormValues = {
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  website: string;
  tax_id: string;
};

export const BusinessDetailsForm = () => {
  const { 
    businessDetails, 
    isLoading, 
    isUploading,
    updateBusinessDetails, 
    uploadLogo 
  } = useBusinessDetails();
  
  const [logoPreview, setLogoPreview] = useState<string | null>(businessDetails?.logo_url || null);
  
  const form = useForm<BusinessFormValues>({
    defaultValues: {
      name: businessDetails?.name || '',
      address: businessDetails?.address || '',
      city: businessDetails?.city || '',
      state: businessDetails?.state || '',
      postcode: businessDetails?.postcode || '',
      phone: businessDetails?.phone || '',
      email: businessDetails?.email || '',
      website: businessDetails?.website || '',
      tax_id: businessDetails?.tax_id || ''
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
        tax_id: businessDetails.tax_id || ''
      });
      
      setLogoPreview(businessDetails.logo_url || null);
    }
  }, [businessDetails, form]);
  
  const onSubmit = (data: BusinessFormValues) => {
    updateBusinessDetails(data);
  };
  
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!isImageFile(file.name)) {
      alert('Please upload an image file (jpg, png, etc.)');
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload the file
    uploadLogo(file);
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
          Update your business information and logo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="border rounded-lg overflow-hidden w-full aspect-square flex items-center justify-center bg-muted">
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
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Recommended: Square image, 512x512px or larger
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
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Business Name" {...field} />
                    </FormControl>
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
                      <FormLabel>Address</FormLabel>
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
                        <Input placeholder="www.yourbusiness.com" {...field} />
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
                      <FormLabel>Tax ID / ABN</FormLabel>
                      <FormControl>
                        <Input placeholder="Tax ID or ABN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="mt-4"
                  disabled={form.formState.isSubmitting}
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

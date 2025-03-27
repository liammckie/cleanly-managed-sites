import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteStatus } from '@/types/common';
import { useSite } from '@/hooks/useSite';
import { useSiteUpdate } from '@/hooks/useSiteUpdate';
import { SiteRecord } from '@/lib/types';

const siteFormSchema = z.object({
  name: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  postalCode: z.string().min(4, {
    message: "Postal code must be at least 4 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  status: z.enum(['active', 'pending', 'inactive', 'on-hold', 'lost'] as const),
});

type SiteFormValues = z.infer<typeof siteFormSchema>;

export function EditSiteForm() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { site, isLoading } = useSite(siteId);
  const { updateSiteMutation } = useSiteUpdate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any[]>([]);
  
  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      status: 'active',
    }
  });
  
  useEffect(() => {
    if (site) {
      form.reset({
        name: site.name,
        address: site.address || '',
        city: site.city || '',
        state: site.state || '',
        postalCode: site.postal_code || site.postcode || '',
        country: site.country || '',
        status: (site.status || 'active') as SiteStatus,
      });
    }
  }, [site, form]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteId) return;
    
    setIsSubmitting(true);
    
    try {
      const formValues = form.getValues();

      const updatedFormData: SiteFormData = {
        name: formValues.name,
        address: formValues.address,
        city: formValues.city,
        state: formValues.state,
        postalCode: formValues.postalCode,
        country: formValues.country,
        status: formValues.status,
        client_id: site?.client_id,
        client_name: site?.client_name,
        contacts: site?.contacts || [],
        notes: site?.notes || '',
        contract_details: site?.contract_details || {},
        billingDetails: site?.billing_details || {},
        jobSpecifications: site?.job_specifications || {},
      };
      
      const siteUpdateData: Partial<SiteRecord> = {
        name: formValues.name,
        address: formValues.address,
        city: formValues.city,
        state: formValues.state,
        postal_code: formValues.postalCode,
        country: formValues.country,
        status: formValues.status,
        client_id: site?.client_id,
        client_name: site?.client_name,
        notes: site?.notes,
        contract_details: site?.contract_details,
        billing_details: site?.billing_details,
        job_specifications: site?.job_specifications,
      };
      
      const result = await updateSiteMutation.mutateAsync({
        id: siteId,
        data: siteUpdateData
      });
      
      if (result) {
        toast.success("Site updated successfully");
        navigate(`/sites/${siteId}`);
      } else {
        toast.error("Failed to update site");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error updating site:", error);
      toast.error("An error occurred while updating the site");
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!site) {
    return (
      <div className="text-center py-8">
        <p>Site not found</p>
        <Button onClick={() => navigate('/sites')} className="mt-4">
          Return to Sites
        </Button>
      </div>
    );
  }
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Site Name</Label>
                <Input id="name" type="text" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" type="text" {...form.register("address")} />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" type="text" {...form.register("city")} />
                  {form.formState.errors.city && (
                    <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" type="text" {...form.register("state")} />
                  {form.formState.errors.state && (
                    <p className="text-sm text-red-500">{form.formState.errors.state.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" type="text" {...form.register("postalCode")} />
                  {form.formState.errors.postalCode && (
                    <p className="text-sm text-red-500">{form.formState.errors.postalCode.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" type="text" {...form.register("country")} />
                {form.formState.errors.country && (
                  <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full px-3 py-2 border rounded"
                  {...form.register("status")}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-hold">On Hold</option>
                  <option value="lost">Lost</option>
                </select>
                {form.formState.errors.status && (
                  <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
                )}
              </div>
            </div>
            
            {errors.length > 0 && (
              <div className="rounded-md bg-red-50 p-4">
                <h3 className="text-sm font-medium text-red-800">
                  There were errors with your submission:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate('/sites')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Site
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSite } from '@/hooks/useSite';
import { useSiteUpdate } from '@/hooks/useSiteUpdate';
import { toast } from 'sonner';
import { EditSiteForm } from '@/components/sites/forms/edit/EditSiteForm';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SiteEdit() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { site, isLoading, refetch } = useSite(siteId);
  const { updateSiteMutation } = useSiteUpdate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!siteId) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await updateSiteMutation.mutateAsync({
        id: siteId,
        data: {
          ...data,
          postal_code: data.postalCode || data.postal_code,
        }
      });
      
      toast.success("Site updated successfully");
      await refetch();
      navigate(`/sites/${siteId}`);
    } catch (error: any) {
      console.error("Error updating site:", error);
      toast.error(`Failed to update site: ${error.message}`);
    } finally {
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
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Site: {site.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <EditSiteForm />
        </CardContent>
      </Card>
    </div>
  );
}

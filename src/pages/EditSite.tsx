
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSite } from '@/hooks/useSite';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditSiteForm } from '@/components/sites/forms/edit/EditSiteForm';

export default function EditSite() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { site, isLoading, error, refetch } = useSite(siteId);
  
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

import React, { useState } from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSites } from '@/hooks/useSites';
import { SiteRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const CreateContract = () => {
  const { data: sites, isLoading: sitesLoading } = useSites();
  const navigate = useNavigate();
  
  const handleSiteSelect = (site: SiteRecord) => {
    if (site && site.id) {
      navigate(`/sites/${site.id}/contracts/create`);
    }
  };
  
  if (sitesLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Create New Contract</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Select a site for this contract</CardTitle>
          </CardHeader>
          <CardContent>
            {sites && sites.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sites.map((site) => (
                  <Card 
                    key={site.id || `site-${site.name}`} 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleSiteSelect(site)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{site.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{site.address}</p>
                      <p className="text-sm text-muted-foreground">{site.city}, {site.state}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-6">
                <p className="text-muted-foreground mb-4">No sites found. Please create a site first.</p>
                <Button onClick={() => navigate('/sites/create')}>Create Site</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CreateContract;

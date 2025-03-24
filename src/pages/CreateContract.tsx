
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSites } from '@/hooks/useSites';

const CreateContract = () => {
  const { sites } = useSites();
  
  return (
    <PageLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Create New Contract</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Select a site for this contract</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sites?.map((site) => (
                <Card key={site.id} className="cursor-pointer hover:border-primary">
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
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CreateContract;

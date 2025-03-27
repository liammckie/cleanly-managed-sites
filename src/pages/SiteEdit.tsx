
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSite } from '@/hooks/useSite';
import { DashboardLayout } from '@/components/ui/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { EditSiteForm } from '@/components/sites/forms/edit/EditSiteForm';

const SiteEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { site, isLoading, error } = useSite(id);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Site</h1>
          
          <div className="flex space-x-3">
            <Button variant="outline" asChild>
              <Link to={`/sites/${id}`}>
                Cancel
              </Link>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive">
            <h3 className="text-xl font-semibold mb-2">Error Loading Site</h3>
            <p>{error.message || 'Unable to load site details'}</p>
            
            <Button className="mt-4" asChild>
              <Link to="/sites">Return to Sites</Link>
            </Button>
          </div>
        ) : site ? (
          <div className="max-w-5xl mx-auto">
            <EditSiteForm 
              site={site}
              initialData={site}
              siteId={id} 
              isLoading={false}
              onSubmit={() => {}}
            />
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Site Not Found</h3>
            <p>The requested site could not be found.</p>
            
            <Button className="mt-4" asChild>
              <Link to="/sites">Return to Sites</Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SiteEdit;

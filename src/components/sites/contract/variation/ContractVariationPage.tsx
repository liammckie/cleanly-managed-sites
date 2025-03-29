
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { BillingVariationForm } from './billing/BillingVariationForm';
import { ContractorChangeForm } from './ContractorChangeForm';
import { useSite } from '@/hooks/useSite';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

/**
 * Component props including siteId
 */
interface ContractVariationPageProps {
  siteId?: string;
}

/**
 * Contract Variation Page component
 * Displays tabs for different types of contract variations
 */
export const ContractVariationPage: React.FC<ContractVariationPageProps> = ({ siteId: propSiteId }) => {
  // Get site ID from props or URL params
  const { siteId: urlSiteId } = useParams<{ siteId: string }>();
  const siteId = propSiteId || urlSiteId;
  const navigate = useNavigate();
  
  const { site, isLoading } = useSite(siteId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!site) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Not Found</CardTitle>
          <CardDescription>
            The requested site could not be found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/sites')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Sites
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleBack = () => {
    navigate(`/sites/${siteId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Contract Variation</h1>
          <p className="text-muted-foreground">
            Site: {site.name} | Client: {site.client_name}
          </p>
        </div>
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Site
        </Button>
      </div>

      <Tabs defaultValue="billing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="billing">Billing Variation</TabsTrigger>
          <TabsTrigger value="contractor">Contractor Change</TabsTrigger>
        </TabsList>
        
        <TabsContent value="billing">
          <BillingVariationForm />
        </TabsContent>
        
        <TabsContent value="contractor">
          <ContractorChangeForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractVariationPage;

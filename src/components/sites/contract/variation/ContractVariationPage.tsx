
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BillingVariationForm } from './billing';
import { ContractorChangeForm } from './ContractorChangeForm';
import { useSite } from '@/hooks/useSite';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Component to display different variation options for selection
const ContractVariationSelector = ({ siteId }: { siteId: string }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Contract Variation Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate(`/sites/${siteId}/contract-variations/billing`)}
          className="h-auto py-6 flex flex-col items-center justify-center"
          variant="outline"
        >
          <span className="text-lg">Billing Variation</span>
          <span className="text-sm text-muted-foreground mt-2">
            Change contract value or billing frequency
          </span>
        </Button>
        
        <Button 
          onClick={() => navigate(`/sites/${siteId}/contract-variations/contractor`)}
          className="h-auto py-6 flex flex-col items-center justify-center"
          variant="outline"
        >
          <span className="text-lg">Contractor Change</span>
          <span className="text-sm text-muted-foreground mt-2">
            Reassign the contract to a different contractor
          </span>
        </Button>
      </div>
    </div>
  );
};

export function ContractVariationPage() {
  const { siteId, variationType } = useParams<{ siteId: string; variationType?: string }>();
  const navigate = useNavigate();
  const { site, isLoading } = useSite(siteId!);
  
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
  
  // Back button handler
  const handleBack = () => {
    if (variationType) {
      // If we're on a specific variation type, go back to the selection screen
      navigate(`/sites/${siteId}/contract-variations`);
    } else {
      // If we're on the selection screen, go back to the site detail
      navigate(`/sites/${siteId}`);
    }
  };
  
  // Render the appropriate component based on variation type
  const renderVariationContent = () => {
    switch (variationType) {
      case 'billing':
        return <BillingVariationForm siteId={siteId!} />;
      case 'contractor':
        return <ContractorChangeForm siteId={siteId!} />;
      default:
        // If no specific variation or unknown, show the selector
        return <ContractVariationSelector siteId={siteId!} />;
    }
  };
  
  return (
    <div className="container py-6">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> 
          Back
        </Button>
      </div>
      
      {renderVariationContent()}
    </div>
  );
}

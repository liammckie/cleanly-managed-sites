
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContractVariationSelector } from './ContractVariationSelector';
import { BillingVariationForm } from './billing';
import { ContractorChangeForm } from './ContractorChangeForm';
import { useSite } from '@/hooks/useSite';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function ContractVariationPage() {
  const { siteId, variationType } = useParams<{ siteId: string; variationType?: string }>();
  const navigate = useNavigate();
  const { site, isLoading } = useSite(siteId);
  
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

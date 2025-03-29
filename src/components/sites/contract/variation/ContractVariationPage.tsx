
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  
  // Render the appropriate component based on variation type
  const renderVariationContent = () => {
    switch (variationType) {
      case 'billing':
        return <BillingVariationForm />;
      case 'contractor':
        return <ContractorChangeForm />;
      default:
        // If no specific variation or unknown, show the selector
        return <ContractVariationSelector siteId={siteId!} />;
    }
  };
  
  return (
    <div className="container py-6">
      {renderVariationContent()}
    </div>
  );
}

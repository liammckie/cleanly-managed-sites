
import React from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { ContractVariationSelector } from './ContractVariationSelector';
import { BillingVariationForm } from './billing';
import { ContractorChangeForm } from './ContractorChangeForm';
import { useSite } from '@/hooks/useSite';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function ContractVariationPage() {
  const { siteId } = useParams<{ siteId: string }>();
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
  
  return (
    <div className="container py-6">
      <Routes>
        <Route index element={<ContractVariationSelector siteId={siteId!} />} />
        <Route path="billing" element={<BillingVariationForm />} />
        <Route path="contractor" element={<ContractorChangeForm />} />
        {/* The routes below will be implemented as needed, for now they will redirect to the selector */}
        <Route path="*" element={<ContractVariationSelector siteId={siteId!} />} />
      </Routes>
    </div>
  );
}

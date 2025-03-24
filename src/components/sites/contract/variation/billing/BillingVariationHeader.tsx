
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface BillingVariationHeaderProps {
  siteName: string;
  clientName: string;
  siteId: string;
}

export function BillingVariationHeader({ siteName, clientName, siteId }: BillingVariationHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(`/sites/${siteId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Site
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Contract Billing Variation</CardTitle>
        </CardHeader>
      </Card>
    </>
  );
}

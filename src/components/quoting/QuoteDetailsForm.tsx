import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote } from '@/types/models';

interface QuoteDetailsFormProps {
  quote?: Quote;
  formData?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onOverheadProfileSelect?: (profileId: string) => void;
  overheadProfiles?: { value: string; label: string; laborPercentage: number }[];
  isLoadingProfiles?: boolean;
  onUpdate?: (field: string, value: any) => void;
}

export function QuoteDetailsForm({ 
  quote, 
  formData, 
  onChange, 
  onOverheadProfileSelect, 
  overheadProfiles, 
  isLoadingProfiles,
  onUpdate 
}: QuoteDetailsFormProps) {
  // If we have formData, we're in create/edit mode
  if (formData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quote Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form fields would go here */}
            <p>Form fields for editing quote details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Otherwise we're in view mode
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p><strong>Quote Name:</strong> {quote?.name}</p>
            <p><strong>Client:</strong> {quote?.clientName}</p>
            <p><strong>Site:</strong> {quote?.siteName}</p>
            <p><strong>Status:</strong> {quote?.status}</p>
          </div>
          <div className="space-y-2">
            <p><strong>Total Price:</strong> ${quote?.totalPrice?.toFixed(2) || '0.00'}</p>
            <p><strong>Labor Cost:</strong> ${quote?.laborCost?.toFixed(2) || '0.00'}</p>
            <p><strong>Overhead %:</strong> {quote?.overheadPercentage || 0}%</p>
            <p><strong>Margin %:</strong> {quote?.marginPercentage || 0}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

interface BusinessDetailsCardProps {
  children: React.ReactNode;
}

export const BusinessDetailsCard = ({ children }: BusinessDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          My Business Details
        </CardTitle>
        <CardDescription>
          Update your business information and logo. This information will appear on invoices, reports, and client communications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

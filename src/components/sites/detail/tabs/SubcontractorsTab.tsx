
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Banknote, Mail, Phone } from 'lucide-react';
import { serviceOptions } from '@/components/sites/forms/types/subcontractorTypes';
import { Subcontractor } from '@/components/sites/forms/types/subcontractorTypes';

interface SubcontractorsTabProps {
  site?: any;
  isLoading?: boolean;
}

export function SubcontractorsTab({ site, isLoading }: SubcontractorsTabProps) {
  // Get subcontractors from site data
  const subcontractors = site?.subcontractors || [];
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!subcontractors || subcontractors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subcontractors</CardTitle>
          <CardDescription>
            No subcontractors are assigned to this site.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const getServiceLabels = (services: string[] = []) => {
    if (!services || services.length === 0) return 'General Services';
    
    return services.map(serviceId => {
      const option = serviceOptions.find(opt => opt.value === serviceId);
      return option?.label || serviceId;
    }).join(', ');
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subcontractors</CardTitle>
        <CardDescription>
          Third-party service providers assigned to this site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subcontractors.map((subcontractor: Subcontractor) => (
            <Card key={subcontractor.id || `sc-${Math.random()}`}>
              <CardHeader>
                <CardTitle className="text-lg">{subcontractor.business_name}</CardTitle>
                <CardDescription>
                  Contact: {subcontractor.contact_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {subcontractor.services?.map((service: string) => {
                    const serviceOption = serviceOptions.find(option => option.value === service);
                    return (
                      <Badge key={serviceOption?.value || service} variant="outline">
                        {serviceOption?.label || service}
                      </Badge>
                    );
                  })}
                  {(!subcontractor.services || subcontractor.services.length === 0) && (
                    <Badge variant="outline">General Services</Badge>
                  )}
                </div>
                
                {subcontractor.customServices && (
                  <div className="text-sm">
                    <span className="font-medium">Custom Services:</span> {subcontractor.customServices}
                  </div>
                )}
                
                <div className="flex items-center gap-6">
                  {subcontractor.email && (
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3.5 w-3.5 opacity-70" />
                      <span>{subcontractor.email}</span>
                    </div>
                  )}
                  
                  {subcontractor.phone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3.5 w-3.5 opacity-70" />
                      <span>{subcontractor.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <Banknote className="h-3.5 w-3.5 opacity-70" />
                  <span>
                    <strong>Monthly Cost:</strong> {formatCurrency(subcontractor.monthly_cost)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

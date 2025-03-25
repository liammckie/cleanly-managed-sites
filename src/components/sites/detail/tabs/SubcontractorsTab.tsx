
import React from 'react';
import { SiteRecord } from '@/lib/api';
import { Briefcase, DollarSign, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { serviceOptions } from '@/components/sites/forms/types/subcontractorTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface SubcontractorsTabProps {
  site: SiteRecord;
}

export function SubcontractorsTab({ site }: SubcontractorsTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Briefcase size={18} className="text-primary" />
        Subcontractor Details
      </h3>
      
      {(!site.subcontractors || site.subcontractors.length === 0) && (
        <div className="text-center py-8 border border-dashed rounded-md">
          <p className="text-muted-foreground">No subcontractors assigned to this site.</p>
        </div>
      )}
      
      {site.subcontractors?.map((subcontractor, index) => (
        <Card key={index} className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{subcontractor.business_name}</span>
              {subcontractor.monthly_cost && (
                <Badge variant="outline" className="flex items-center ml-2">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {subcontractor.monthly_cost}/month
                  {subcontractor.is_flat_rate ? ' (Flat Rate)' : ' (Hourly)'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Contact Name</p>
                <p>{subcontractor.contact_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{subcontractor.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{subcontractor.email}</p>
              </div>
            </div>
            
            {(subcontractor.services?.length > 0 || subcontractor.custom_services) && (
              <>
                <Separator className="my-4" />
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Services Provided</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {subcontractor.services?.map(service => {
                      const serviceOption = serviceOptions.find(s => s.value === service);
                      return (
                        <Badge key={service} variant="secondary" className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {serviceOption?.label || service}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  {subcontractor.custom_services && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Additional Services</p>
                      <p className="mt-1">{subcontractor.custom_services}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

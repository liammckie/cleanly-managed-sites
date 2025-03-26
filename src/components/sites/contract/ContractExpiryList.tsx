import React from 'react';
import { SiteRecord } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from '@/components/ui/badge';
import { asJsonObject } from '@/lib/utils/json';

interface ContractExpiryListProps {
  sites: SiteRecord[];
  isLoading: boolean;
}

/**
 * Component to display a list of contracts expiring soon
 */
export function ContractExpiryList({ sites, isLoading }: ContractExpiryListProps) {
  if (isLoading) {
    return <p>Loading expiring contracts...</p>;
  }

  if (!sites || sites.length === 0) {
    return <p>No expiring contracts found.</p>;
  }

  // Filter sites to only include those expiring within the next 90 days
  const expiringSites = sites.filter(site => {
    if (!site.contract_details) return false;

    const contractDetails = asJsonObject(site.contract_details, {});
    const endDate = contractDetails.endDate;

    if (!endDate) return false;

    const expiryDate = parseISO(endDate);
    const now = new Date();
    const timeDiff = expiryDate.getTime() - now.getTime();
    const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysUntilExpiry <= 90 && daysUntilExpiry >= 0;
  });

  // Sort sites by expiry date
  expiringSites.sort((a, b) => {
    const contractDetailsA = asJsonObject(a.contract_details || {}, {});
    const contractDetailsB = asJsonObject(b.contract_details || {}, {});

    const endDateA = contractDetailsA.endDate;
    const endDateB = contractDetailsB.endDate;

    if (!endDateA || !endDateB) return 0;

    const expiryDateA = parseISO(endDateA);
    const expiryDateB = parseISO(endDateB);

    return expiryDateA.getTime() - expiryDateB.getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expiring Contracts (Next 90 Days)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px] w-full">
          <div className="p-4">
            {expiringSites.map(site => {
              const contractDetails = asJsonObject(site.contract_details || {}, {});
              const endDate = contractDetails.endDate;

              if (!endDate) return null;

              const expiryDate = parseISO(endDate);
              const now = new Date();
              const timeDiff = expiryDate.getTime() - now.getTime();
              const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

              // Ensure contractNumber is safely accessed
              const contractNumber = asJsonObject(site.contract_details || {}, {}).contractNumber || 'N/A';

              return (
                <div key={site.id} className="mb-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{site.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Client: {site.client_name}
                      </p>
                    </div>
                    <div>
                      {daysUntilExpiry <= 30 ? (
                        <Badge variant="destructive">
                          Expires in {daysUntilExpiry} days
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Expires in {daysUntilExpiry} days
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm">
                      Contract Number: {contractNumber}
                    </p>
                    <p className="text-sm">
                      Expires On: {format(expiryDate, 'PPP')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SiteRecord } from '@/lib/types';
import { Edit, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils/date';
import { isContractExpiringSoon, getContractField } from '@/lib/utils/contractUtils';
import { BadgeVariant } from '@/types/ui';

interface SiteDetailHeaderProps {
  site: SiteRecord;
  isLoading: boolean;
}

// Skeleton component for loading state
const SiteDetailHeaderSkeleton = () => (
  <Card className="mb-6">
    <CardContent className="pt-6">
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48 mb-1" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const SiteDetailHeader: React.FC<SiteDetailHeaderProps> = ({ site, isLoading }) => {
  if (isLoading) {
    return <SiteDetailHeaderSkeleton />;
  }

  const getStatusBadgeVariant = (): BadgeVariant => {
    switch (site.status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'warning';
      case 'on-hold':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Check if contract is expiring soon
  const contractIsExpiringSoon = isContractExpiringSoon(site.contract_details, 60);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl font-bold">{site.name}</h1>
              <Badge variant={getStatusBadgeVariant()}>
                {site.status === 'on-hold' ? 'On Hold' : site.status.charAt(0).toUpperCase() + site.status.slice(1)}
              </Badge>
              {contractIsExpiringSoon && (
                <Badge variant="warning">
                  Contract Expiring Soon
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {site.address}, {site.city}, {site.state} {site.postcode}
            </p>
            <p className="text-muted-foreground">
              Client: {site.client_name || 'Unknown'}
            </p>
          </div>
          <div className="flex items-start space-x-2 mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link to={`/sites/${site.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Site
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

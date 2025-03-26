
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SiteRecord } from '@/lib/types';
import { Edit, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface SiteDetailHeaderProps {
  site: SiteRecord;
  isLoading: boolean;
}

export const SiteDetailHeader: React.FC<SiteDetailHeaderProps> = ({
  site,
  isLoading
}) => {
  if (isLoading) {
    return <SiteDetailHeaderSkeleton />;
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'secondary';
      case 'on-hold':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{site.name}</h1>
              <Badge variant={getStatusBadgeVariant(site.status)}>
                {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-2">
              {site.address && `${site.address}, `}
              {site.city && `${site.city}, `}
              {site.state && `${site.state}, `}
              {site.postcode && site.postcode}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>Client: {site.client_name || 'Unknown'}</span>
              </div>
              {site.contract_details?.endDate && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>Contract Expires: {new Date(site.contract_details.endDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 self-end md:self-start">
            <Link to={`/sites/${site.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" /> Edit Site
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SiteDetailHeaderSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div>
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

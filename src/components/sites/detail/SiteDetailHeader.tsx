
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SiteStatus } from '../SiteCard';
import { SiteRecord } from '@/lib/api';
import { Edit, MapPin } from 'lucide-react';

interface SiteDetailHeaderProps {
  site: SiteRecord;
}

export function SiteDetailHeader({ site }: SiteDetailHeaderProps) {
  const getStatusColor = (status: SiteStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{site.name}</h1>
          <Badge className={getStatusColor(site.status as SiteStatus)}>
            {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-center mt-2 text-muted-foreground">
          <MapPin size={16} className="mr-1" />
          <span>{site.address}, {site.city}, {site.state} {site.postcode}</span>
        </div>
      </div>
      
      <Button asChild className="gap-2">
        <Link to={`/sites/${site.id}/edit`}>
          <Edit size={16} />
          <span>Edit Site</span>
        </Link>
      </Button>
    </div>
  );
}

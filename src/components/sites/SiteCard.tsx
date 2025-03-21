
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SiteStatus = 'active' | 'inactive' | 'pending';

export type SiteCardProps = {
  id: string;
  name: string;
  address: string;
  city: string;
  status: SiteStatus;
  representative: string;
  phone?: string;
  className?: string;
};

export function SiteCard({
  id,
  name,
  address,
  city,
  status,
  representative,
  phone,
  className,
}: SiteCardProps) {
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
    <div className={cn(
      "glass-card p-5 hover-lift",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <h3 className="text-lg font-semibold mt-2">{name}</h3>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin size={16} className="mr-2 flex-shrink-0" />
          <span className="truncate">{address}, {city}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <User size={16} className="mr-2 flex-shrink-0" />
          <span>{representative}</span>
        </div>
        {phone && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone size={16} className="mr-2 flex-shrink-0" />
            <span>{phone}</span>
          </div>
        )}
      </div>
      
      <div className="mt-5 flex justify-end">
        <Button asChild variant="outline" size="sm" className="gap-1 group">
          <Link to={`/sites/${id}`}>
            View Details
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}


import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Phone, Mail, User, MapPin, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on_hold';

export interface SiteCardProps {
  site?: any; // Full site object if provided
  name: string;
  address?: string;
  city?: string;
  status?: SiteStatus;
  representative?: string;
  phone?: string;
  annualBilling?: number | null;
  onClick?: () => void;
  clientName?: string;
  statusBadge?: React.ReactNode;
}

export function SiteCard({
  site,
  name,
  address,
  city,
  status,
  representative,
  phone,
  annualBilling,
  onClick,
  clientName,
  statusBadge
}: SiteCardProps) {
  const getStatusColor = (status: SiteStatus) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'secondary';
      case 'lost':
        return 'destructive';
      case 'on_hold':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{name}</h3>
          {statusBadge || (status && (
            <Badge variant={getStatusColor(status) as any}>
              {status.replace('_', ' ')}
            </Badge>
          ))}
        </div>
        
        {clientName && (
          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            <Building className="mr-1 h-3 w-3" />
            <span>{clientName}</span>
          </div>
        )}
        
        {address && (
          <div className="mt-2 flex items-start">
            <MapPin className="mr-1 h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <div>{address}</div>
              {city && <div className="text-muted-foreground">{city}</div>}
            </div>
          </div>
        )}
        
        {representative && (
          <div className="mt-2 flex items-center">
            <User className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{representative}</span>
          </div>
        )}
        
        {phone && (
          <div className="mt-2 flex items-center">
            <Phone className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{phone}</span>
          </div>
        )}
        
        {annualBilling !== undefined && annualBilling !== null && (
          <div className="mt-2 flex items-center">
            <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{formatCurrency(annualBilling)} / year</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

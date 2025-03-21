
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Phone, User, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export type SiteStatus = 'active' | 'inactive' | 'pending';

export type SiteCardProps = {
  id: string;
  name: string;
  address: string;
  city: string;
  status: SiteStatus;
  representative: string;
  phone?: string;
  clientName?: string;
  annualBilling?: number | null;
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
  clientName,
  annualBilling,
  className,
}: SiteCardProps) {
  const getStatusColor = (status: SiteStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400';
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return null;
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
  };

  return (
    <Card className={cn(
      "shadow-sm transition-all duration-200 hover:shadow-md",
      className
    )}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <h3 className="text-lg font-semibold mt-2">{name}</h3>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {clientName && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Building2 size={16} className="mr-2 flex-shrink-0" />
              <span>{clientName}</span>
            </div>
          )}
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
        
        {annualBilling && (
          <div className="mt-4 pt-3 border-t border-border">
            <div className="text-sm">
              <span className="text-muted-foreground">Annual Billing:</span>
              <span className="font-medium ml-2 text-primary">
                {formatCurrency(annualBilling)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-6 flex justify-end">
        <Button asChild variant="outline" size="sm" className="gap-1 group">
          <Link to={`/sites/${id}`}>
            View Details
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

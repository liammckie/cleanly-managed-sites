
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Building2, Edit } from 'lucide-react';

export type ClientStatus = 'active' | 'inactive' | 'pending';

interface ClientCardProps {
  id: string;
  name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  status: ClientStatus;
  sitesCount?: number;
}

export function ClientCard({ 
  id, 
  name, 
  contact_name, 
  email, 
  phone, 
  address, 
  city, 
  status,
  sitesCount = 0
}: ClientCardProps) {
  // Generate color class based on status
  const statusColor = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-1 text-xl">{name}</CardTitle>
          <Badge className={`${statusColor[status]} capitalize`}>{status}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-0 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{contact_name}</span>
          </div>
          
          {(address || city) && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{[address, city].filter(Boolean).join(', ')}</span>
            </div>
          )}
          
          {email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          )}
          
          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>{phone}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span>{sitesCount} {sitesCount === 1 ? 'site' : 'sites'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 pb-3">
        <div className="flex w-full justify-end gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/clients/${id}`}>View Details</Link>
          </Button>
          <Button asChild size="sm" className="gap-1">
            <Link to={`/clients/${id}/edit`}>
              <Edit size={16} />
              <span>Edit</span>
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

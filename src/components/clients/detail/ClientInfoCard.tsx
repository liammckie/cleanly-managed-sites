
import React from 'react';
import { ClientRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building2
} from 'lucide-react';

interface ClientInfoCardProps {
  client: ClientRecord;
}

export function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Contact Person</p>
            <p>{client.contact_name}</p>
          </div>
        </div>
        
        {client.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Email</p>
              <p className="break-all">{client.email}</p>
            </div>
          </div>
        )}
        
        {client.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Phone</p>
              <p>{client.phone}</p>
            </div>
          </div>
        )}
        
        {(client.address || client.city || client.state || client.postcode) && (
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Address</p>
              <p>{[
                client.address,
                client.city,
                client.state && client.postcode ? `${client.state} ${client.postcode}` : client.state || client.postcode
              ].filter(Boolean).join(', ')}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

interface LocationsContentProps {
  locations: any[];
}

export const LocationsContent: React.FC<LocationsContentProps> = ({ locations }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Business Locations</h2>
        <Button>
          <Building2 className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>
      
      {locations && locations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardHeader>
                <CardTitle>{location.name}</CardTitle>
                <CardDescription>{location.type.replace('_', ' ')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{location.address}</p>
                  {location.city && (
                    <p className="text-sm">
                      {location.city}, {location.state} {location.postcode}
                    </p>
                  )}
                  {location.phone && <p className="text-sm">Phone: {location.phone}</p>}
                  
                  <div className="pt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
            <Building2 className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">No business locations found. Add your first location to get started.</p>
            <Button>
              <Building2 className="mr-2 h-4 w-4" />
              Add First Location
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

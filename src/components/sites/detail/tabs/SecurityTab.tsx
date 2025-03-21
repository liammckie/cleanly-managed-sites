
import React from 'react';
import { SiteRecord } from '@/lib/api';

interface SecurityTabProps {
  site: SiteRecord;
}

export function SecurityTab({ site }: SecurityTabProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-medium mb-4">Security Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {site.security_details?.accessCode && (
          <div>
            <p className="text-sm text-muted-foreground">Access Code</p>
            <p className="font-medium">•••• <span className="text-xs">(hidden)</span></p>
          </div>
        )}
        
        {site.security_details?.alarmCode && (
          <div>
            <p className="text-sm text-muted-foreground">Alarm Code</p>
            <p className="font-medium">•••• <span className="text-xs">(hidden)</span></p>
          </div>
        )}
        
        <div className="md:col-span-2">
          <p className="text-sm text-muted-foreground">Key Location</p>
          <p className="font-medium">{site.security_details?.keyLocation}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Out of Hours Access</p>
          <p className="font-medium">{site.security_details?.outOfHoursAccess ? 'Available' : 'Not Available'}</p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { SiteRecord } from '@/lib/api';
import { asJsonObject, jsonToString } from '@/lib/utils/json';

interface SecurityTabProps {
  site: SiteRecord;
}

export function SecurityTab({ site }: SecurityTabProps) {
  const securityDetails = asJsonObject(site.security_details, {
    accessCode: '',
    alarmCode: '',
    keyLocation: '',
    outOfHoursAccess: false
  });
  
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-medium mb-4">Security Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Alarm Code</p>
            <p className="font-medium">{jsonToString(securityDetails.alarmCode) || 'N/A'}</p>
          </div>
        
          <div>
            <p className="text-sm text-muted-foreground">Access Code</p>
            <p className="font-medium">{jsonToString(securityDetails.accessCode) || 'N/A'}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Key Location</p>
            <p className="font-medium">{jsonToString(securityDetails.keyLocation) || 'N/A'}</p>
          </div>
        
          <div>
            <p className="text-sm text-muted-foreground">Out of Hours Access</p>
            <p className="font-medium">{securityDetails.outOfHoursAccess ? 'Available' : 'Not Available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

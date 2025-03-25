
import React from 'react';
import { SiteRecord } from '@/lib/api';
import { asJsonObject } from '@/lib/utils/json';

interface PeriodicalsTabProps {
  site: SiteRecord;
}

export function PeriodicalsTab({ site }: PeriodicalsTabProps) {
  const periodicals = asJsonObject(site.periodicals, {
    windowCleaning: {
      frequency: '',
      lastCompleted: '',
      nextScheduled: '',
      charges: ''
    },
    steamCleaning: {
      frequency: '',
      lastCompleted: '',
      nextScheduled: '',
      charges: ''
    }
  });
  
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-medium mb-4">Periodic Cleaning Schedule</h3>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="border p-4 rounded-md">
          <h4 className="text-md font-semibold mb-2">Window Cleaning</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Frequency</p>
              <p className="font-medium">{periodicals.windowCleaning.frequency || 'Not specified'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Last Completed</p>
              <p className="font-medium">{periodicals.windowCleaning.lastCompleted || 'Not recorded'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Next Scheduled</p>
              <p className="font-medium">{periodicals.windowCleaning.nextScheduled || 'Not scheduled'}</p>
            </div>
          </div>
        </div>
        
        <div className="border p-4 rounded-md">
          <h4 className="text-md font-semibold mb-2">Steam Cleaning</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Frequency</p>
              <p className="font-medium">{periodicals.steamCleaning.frequency || 'Not specified'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Charges</p>
              <p className="font-medium">{periodicals.steamCleaning.charges || 'Not specified'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Last Completed</p>
              <p className="font-medium">{periodicals.steamCleaning.lastCompleted || 'Not recorded'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Next Scheduled</p>
              <p className="font-medium">{periodicals.steamCleaning.nextScheduled || 'Not scheduled'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

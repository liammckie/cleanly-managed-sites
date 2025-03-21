
import React from 'react';
import { SiteRecord } from '@/lib/api';

interface PeriodicalsTabProps {
  site: SiteRecord;
}

export function PeriodicalsTab({ site }: PeriodicalsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4">Window Cleaning</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Frequency</p>
            <p className="font-medium">{site.periodicals?.windowCleaning.frequency}</p>
          </div>
          
          {site.periodicals?.windowCleaning.lastCompleted && (
            <div>
              <p className="text-sm text-muted-foreground">Last Completed</p>
              <p className="font-medium">{site.periodicals?.windowCleaning.lastCompleted}</p>
            </div>
          )}
          
          {site.periodicals?.windowCleaning.nextScheduled && (
            <div>
              <p className="text-sm text-muted-foreground">Next Scheduled</p>
              <p className="font-medium">{site.periodicals?.windowCleaning.nextScheduled}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4">Steam Cleaning</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Frequency</p>
            <p className="font-medium">{site.periodicals?.steamCleaning.frequency}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Charges</p>
            <p className="font-medium">{site.periodicals?.steamCleaning.charges}</p>
          </div>
          
          {site.periodicals?.steamCleaning.lastCompleted && (
            <div>
              <p className="text-sm text-muted-foreground">Last Completed</p>
              <p className="font-medium">{site.periodicals?.steamCleaning.lastCompleted}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

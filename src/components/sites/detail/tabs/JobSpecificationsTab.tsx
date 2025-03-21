
import React from 'react';
import { SiteRecord } from '@/lib/api';
import { FileText } from 'lucide-react';

interface JobSpecificationsTabProps {
  site: SiteRecord;
}

export function JobSpecificationsTab({ site }: JobSpecificationsTabProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
        <FileText size={18} className="text-primary" />
        Job Specifications
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Days Per Week</p>
          <p className="text-xl font-medium">{site.job_specifications?.daysPerWeek}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Hours Per Day</p>
          <p className="text-xl font-medium">{site.job_specifications?.hoursPerDay}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Direct Employees</p>
          <p className="text-xl font-medium">{site.job_specifications?.directEmployees ? 'Yes' : 'No'}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-muted-foreground">Notes</p>
        <p className="mt-1">{site.job_specifications?.notes}</p>
      </div>
    </div>
  );
}

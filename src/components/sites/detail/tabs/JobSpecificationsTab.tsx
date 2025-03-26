import React from 'react';
import { SiteRecord } from '@/lib/api';
import { FileText } from 'lucide-react';
import { asJsonObject, jsonToString } from '@/lib/utils/json';

interface JobSpecificationsTabProps {
  site: SiteRecord;
}

export function JobSpecificationsTab({ site }: JobSpecificationsTabProps) {
  const jobSpecifications = asJsonObject(site.job_specifications, {
    daysPerWeek: '',
    hoursPerDay: '',
    directEmployees: false,
    notes: ''
  });
  
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-medium mb-4">Job Specifications</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Cleaning Days per Week</p>
          <p className="font-medium">{jsonToString(jobSpecifications.daysPerWeek) || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Cleaning Hours per Day</p>
          <p className="font-medium">{jsonToString(jobSpecifications.hoursPerDay) || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Direct Employees</p>
          <p className="font-medium">{jobSpecifications.directEmployees ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}

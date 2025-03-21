
import React from 'react';
import { SiteRecord } from '@/lib/api';
import { Briefcase } from 'lucide-react';

interface SubcontractorsTabProps {
  site: SiteRecord;
}

export function SubcontractorsTab({ site }: SubcontractorsTabProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
        <Briefcase size={18} className="text-primary" />
        Subcontractor Details
      </h3>
      
      {site.subcontractors?.map((subcontractor, index) => (
        <div key={index} className="border-b border-border py-4 last:border-0 last:pb-0">
          <h4 className="font-medium">{subcontractor.business_name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-muted-foreground">Contact Name</p>
              <p>{subcontractor.contact_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{subcontractor.phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{subcontractor.email}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

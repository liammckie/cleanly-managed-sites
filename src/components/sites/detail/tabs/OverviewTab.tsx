
import React from 'react';
import { SiteRecord } from '@/lib/api';
import { User, Phone, Mail, Calendar } from 'lucide-react';

interface OverviewTabProps {
  site: SiteRecord;
}

export function OverviewTab({ site }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <User size={18} className="text-primary" />
          Contact Information
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Representative</p>
            <p className="font-medium">{site.representative}</p>
          </div>
          
          {site.phone && (
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium flex items-center gap-2">
                <Phone size={16} className="text-muted-foreground" />
                {site.phone}
              </p>
            </div>
          )}
          
          {site.email && (
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium flex items-center gap-2">
                <Mail size={16} className="text-muted-foreground" />
                {site.email}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Calendar size={18} className="text-primary" />
          Timeline Information
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Created On</p>
            <p className="font-medium">{site.created_at}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="font-medium">{site.created_at}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

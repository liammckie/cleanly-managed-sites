
import React from 'react';
import { SiteRecord } from '@/lib/api';
import { asJsonObject } from '@/lib/utils/json';

interface SuppliesTabProps {
  site: SiteRecord;
}

export function SuppliesTab({ site }: SuppliesTabProps) {
  const replenishables = asJsonObject(site.replenishables, { stock: [] });
  
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-medium mb-4">Replenishable Stock</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Stock Items</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {replenishables.stock.map((item, index) => (
              <div key={index} className="bg-secondary p-2 rounded-md">
                {item}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Contact Details</p>
          <p className="mt-1">{replenishables.contactDetails}</p>
        </div>
      </div>
    </div>
  );
}

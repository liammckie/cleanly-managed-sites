
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ContactCounts {
  all: number;
  client: number;
  site: number;
  supplier: number;
  internal: number;
}

interface ContactManagementTabsProps {
  onValueChange: (value: string) => void;
  defaultValue?: string;
  counts?: ContactCounts;
}

export function ContactManagementTabs({ 
  onValueChange, 
  defaultValue = 'all',
  counts = { all: 0, client: 0, site: 0, supplier: 0, internal: 0 }
}: ContactManagementTabsProps) {
  return (
    <Tabs 
      defaultValue={defaultValue} 
      onValueChange={onValueChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
        <TabsTrigger value="all" className="flex items-center justify-center gap-2">
          All
          {counts.all > 0 && (
            <Badge variant="secondary" className="ml-1">{counts.all}</Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger value="client" className="flex items-center justify-center gap-2">
          Client 
          {counts.client > 0 && (
            <Badge variant="secondary" className="ml-1">{counts.client}</Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger value="site" className="flex items-center justify-center gap-2">
          Site
          {counts.site > 0 && (
            <Badge variant="secondary" className="ml-1">{counts.site}</Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger value="supplier" className="flex items-center justify-center gap-2">
          Supplier
          {counts.supplier > 0 && (
            <Badge variant="secondary" className="ml-1">{counts.supplier}</Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger value="internal" className="flex items-center justify-center gap-2">
          Internal
          {counts.internal > 0 && (
            <Badge variant="secondary" className="ml-1">{counts.internal}</Badge>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

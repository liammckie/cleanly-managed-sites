import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Building, Briefcase, Users } from 'lucide-react';

export function ContactManagementTabs() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 lg:w-auto">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden md:inline">All Contacts</span>
          <span className="md:hidden">All</span>
        </TabsTrigger>
        <TabsTrigger value="client" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span className="hidden md:inline">Client</span>
          <span className="md:hidden">Client</span>
        </TabsTrigger>
        <TabsTrigger value="site" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          <span className="hidden md:inline">Site</span>
          <span className="md:hidden">Site</span>
        </TabsTrigger>
        <TabsTrigger value="supplier" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          <span className="hidden md:inline">Supplier</span>
          <span className="md:hidden">Supplier</span>
        </TabsTrigger>
        <TabsTrigger value="internal" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden md:inline">Internal</span>
          <span className="md:hidden">Internal</span>
        </TabsTrigger>
      </TabsList>
      
      {/* The tab content remains the same as we use a unified view with filters */}
      <TabsContent value="all">
        {/* Content will be rendered in the parent component */}
      </TabsContent>
      <TabsContent value="client">
        {/* Content will be rendered in the parent component */}
      </TabsContent>
      <TabsContent value="site">
        {/* Content will be rendered in the parent component */}
      </TabsContent>
      <TabsContent value="supplier">
        {/* Content will be rendered in the parent component */}
      </TabsContent>
      <TabsContent value="internal">
        {/* Content will be rendered in the parent component */}
      </TabsContent>
    </Tabs>
  );
}

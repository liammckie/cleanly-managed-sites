
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { Calculator, Settings, Table } from 'lucide-react';
import { AwardSettingsForm } from '@/components/award/AwardSettingsForm';
import { JobCostCalculator } from '@/components/award/JobCostCalculator';
import { AwardRatesTable } from '@/components/award/AwardRatesTable';

export function AwardEngine() {
  const [activeTab, setActiveTab] = React.useState('calculator');

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <main className="flex-1 overflow-y-auto py-6">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Calculator className="h-8 w-8" />
                    Award Engine
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Calculate labor costs and manage award rates for quoting and contract forecasting
                  </p>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="calculator" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Cost Calculator
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Award Settings
                  </TabsTrigger>
                  <TabsTrigger value="rates" className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    Award Rates
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="calculator" className="space-y-6">
                  <JobCostCalculator />
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-6">
                  <AwardSettingsForm />
                </TabsContent>
                
                <TabsContent value="rates" className="space-y-6">
                  <AwardRatesTable />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AwardEngine;

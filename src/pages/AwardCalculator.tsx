
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobCostCalculator } from '@/components/award/JobCostCalculator';
import { AwardRatesTable } from '@/components/award/AwardRatesTable';
import { AwardSettingsForm } from '@/components/award/AwardSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, FileSpreadsheet, Sliders } from 'lucide-react';

export default function AwardCalculator() {
  return (
    <PageLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Award Calculator</h1>
          <p className="text-muted-foreground">
            Calculate labor costs based on the Cleaning Services Award [MA000022]
          </p>
        </div>
        
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span>Labor Cost</span>
            </TabsTrigger>
            <TabsTrigger value="rates" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Award Rates</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="calculator">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Labor Cost Calculator</CardTitle>
                  <CardDescription>
                    Calculate labor costs based on the Cleaning Services Award [MA000022]
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JobCostCalculator />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        
          <TabsContent value="rates">
            <AwardRatesTable />
          </TabsContent>
        
          <TabsContent value="settings">
            <AwardSettingsForm />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}


import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobCostCalculator } from '@/components/award/JobCostCalculator';
import { AwardRatesTable } from '@/components/award/AwardRatesTable';
import { AwardSettingsForm } from '@/components/award/AwardSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteBuilder } from './QuoteBuilder';
import { Calculator, FileSpreadsheet, Sliders, Clock, FileText } from 'lucide-react';

export function QuotingDashboard() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Quoting & Labor Planning</h1>
        <p className="text-muted-foreground">
          Create accurate quotes based on the Cleaning Services Award [MA000022]
        </p>
      </div>

      <Tabs defaultValue="quote-builder" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="quote-builder" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Quote Builder</span>
          </TabsTrigger>
          <TabsTrigger value="labor-cost" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Labor Cost</span>
          </TabsTrigger>
          <TabsTrigger value="award-rates" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Award Rates</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="quote-builder">
          <QuoteBuilder />
        </TabsContent>
      
        <TabsContent value="labor-cost">
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
      
        <TabsContent value="award-rates">
          <AwardRatesTable />
        </TabsContent>
      
        <TabsContent value="settings">
          <AwardSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShiftPlanner } from './ShiftPlanner';
import { QuoteSummary } from './QuoteSummary';
import { QuoteDetails } from './QuoteDetails';
import { Calendar, FileText, DollarSign } from 'lucide-react';

export function QuoteBuilder() {
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quote Builder</CardTitle>
          <CardDescription>
            Create and manage detailed cleaning service quotes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shifts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Quote Details</span>
              </TabsTrigger>
              <TabsTrigger value="shifts" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Shift Planner</span>
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Cost Summary</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <QuoteDetails
                quoteId={activeQuoteId}
                onQuoteSelect={setActiveQuoteId}
              />
            </TabsContent>
            
            <TabsContent value="shifts">
              <ShiftPlanner quoteId={activeQuoteId} />
            </TabsContent>
            
            <TabsContent value="summary">
              <QuoteSummary quoteId={activeQuoteId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

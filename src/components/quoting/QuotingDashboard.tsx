
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobCostCalculator } from '@/components/award/JobCostCalculator';
import { AwardRatesTable } from '@/components/award/AwardRatesTable';
import { AwardSettingsForm } from '@/components/award/AwardSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, FileSpreadsheet, Sliders, Clock, FileText, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuoteList } from './QuoteList';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { Quote } from '@/lib/types/quotes';

export function QuotingDashboard() {
  const navigate = useNavigate();
  const { data: quotes = [], isLoading } = useQuotes();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Tabs defaultValue="quotes" className="space-y-6">
      <TabsList className="grid grid-cols-4 w-full max-w-3xl">
        <TabsTrigger value="quotes" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Quotes</span>
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
    
      <TabsContent value="quotes">
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quotes by name, client, or status..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate('/quoting/create')}>
              <Plus className="h-4 w-4 mr-2" />
              New Quote
            </Button>
          </div>
          
          <QuoteList quotes={quotes as Quote[]} searchTerm={searchTerm} isLoading={isLoading} />
        </div>
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
  );
}

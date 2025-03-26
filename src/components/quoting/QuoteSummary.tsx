
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QuoteShift } from '@/lib/award/types';

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Helper function to calculate subcontractor monthly cost
const calculateSubcontractorMonthlyCost = (subcontractor: any): number => {
  if (!subcontractor.cost) return 0;
  
  const frequency = subcontractor.frequency?.toLowerCase() || 'monthly';
  
  switch (frequency) {
    case 'daily':
      return subcontractor.cost * 22; // Approx. working days in a month
    case 'weekly':
      return subcontractor.cost * 4.33; // Average weeks in a month
    case 'fortnightly':
      return subcontractor.cost * 2.17; // Fortnightly in a month
    case 'monthly':
      return subcontractor.cost;
    case 'quarterly':
      return subcontractor.cost / 3;
    case 'annually':
    case 'yearly':
      return subcontractor.cost / 12;
    case 'one_time':
    case 'one-time':
    case 'once':
      return subcontractor.cost;
    case 'per_event':
    case 'per-event':
      return subcontractor.cost;
    default:
      return subcontractor.cost;
  }
};

// Helper function to calculate total hours from shifts
const calculateTotalHours = (shifts: QuoteShift[]): number => {
  return shifts.reduce((total, shift) => {
    const start = new Date(`1970-01-01T${shift.startTime}:00`);
    const end = new Date(`1970-01-01T${shift.endTime}:00`);
    let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    hours -= shift.breakDuration / 60; // Convert break minutes to hours
    return total + (hours * shift.numberOfCleaners);
  }, 0);
};

// Helper function to calculate total costs with overhead and margin
const calculateTotalCostWithOverheadAndMargin = (
  laborCost: number, 
  subcontractorCost: number, 
  overheadPercentage: number, 
  marginPercentage: number
) => {
  const overheadCost = (laborCost * overheadPercentage) / 100;
  const totalCost = laborCost + subcontractorCost + overheadCost;
  const marginAmount = (totalCost * marginPercentage) / 100;
  const totalPrice = totalCost + marginAmount;
  
  return {
    laborCost,
    subcontractorCost,
    overheadCost,
    totalCost,
    marginAmount,
    totalPrice
  };
};

export interface QuoteSummaryProps {
  quoteId: string | null;
  shifts: QuoteShift[];
  subcontractors: any[];
  overheadPercentage: number;
  marginPercentage: number;
}

export function QuoteSummary({ 
  shifts, 
  subcontractors = [], 
  overheadPercentage = 15, 
  marginPercentage = 20 
}: QuoteSummaryProps) {
  
  const laborCost = useMemo(() => 
    shifts.reduce((sum, shift) => sum + (shift.estimatedCost || 0), 0),
  [shifts]);
  
  const subcontractorCost = useMemo(() => 
    subcontractors.reduce((sum, sub) => sum + (sub.cost || 0), 0),
  [subcontractors]);
  
  const totalHours = useMemo(() => calculateTotalHours(shifts), [shifts]);
  
  const costSummary = useMemo(() => calculateTotalCostWithOverheadAndMargin(
    laborCost,
    subcontractorCost,
    overheadPercentage,
    marginPercentage
  ), [laborCost, subcontractorCost, overheadPercentage, marginPercentage]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Labor</div>
              <div className="text-2xl font-semibold">{formatCurrency(costSummary.laborCost)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Total: {totalHours.toFixed(1)} hours
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Overhead ({overheadPercentage}%)</div>
              <div className="text-2xl font-semibold">{formatCurrency(costSummary.overheadCost)}</div>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Subcontractors</div>
              <div className="text-2xl font-semibold">{formatCurrency(costSummary.subcontractorCost)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {subcontractors.length} service provider{subcontractors.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total Cost</div>
              <div className="text-2xl font-semibold">{formatCurrency(costSummary.totalCost)}</div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4 md:col-span-2">
              <div className="text-sm text-muted-foreground">Total Cost Before Margin</div>
              <div className="text-2xl font-semibold">{formatCurrency(costSummary.totalCost)}</div>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Margin ({marginPercentage}%)</div>
              <div className="text-2xl font-semibold">{formatCurrency(costSummary.marginAmount)}</div>
            </div>
          </div>
          
          <div className="mt-6 bg-primary/10 rounded-lg p-6 text-center">
            <div className="text-md text-primary-foreground/80 mb-2">Total Price</div>
            <div className="text-3xl font-bold text-primary-foreground">
              {formatCurrency(costSummary.totalPrice)}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detailed Breakdown</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Labor Cost</TableCell>
                  <TableCell className="text-right">{formatCurrency(costSummary.laborCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Subcontractor Cost</TableCell>
                  <TableCell className="text-right">{formatCurrency(costSummary.subcontractorCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Overhead ({overheadPercentage}% of labor)</TableCell>
                  <TableCell className="text-right">{formatCurrency(costSummary.overheadCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Cost Before Margin</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(costSummary.totalCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Margin ({marginPercentage}%)</TableCell>
                  <TableCell className="text-right">{formatCurrency(costSummary.marginAmount)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Total Price</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(costSummary.totalPrice)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

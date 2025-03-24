import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { QuoteShift, Subcontractor } from '@/lib/award/types';
import { 
  calculateTotalCosts, 
  calculateSubcontractorMonthlyCost, 
  calculateTotalCostWithOverheadAndMargin,
  calculateTotalHours,
  formatCurrency 
} from '@/lib/award/utils';

interface QuoteSummaryProps {
  quoteId?: string | null;
  shifts: QuoteShift[];
  subcontractors: Subcontractor[];
  overheadPercentage: number;
  marginPercentage: number;
}

export function QuoteSummary({ 
  quoteId, 
  shifts, 
  subcontractors, 
  overheadPercentage,
  marginPercentage 
}: QuoteSummaryProps) {
  const [summary, setSummary] = useState<{
    laborCost: number;
    subcontractorCost: number;
    totalHours: number;
    overheadCost: number;
    costBeforeMargin: number;
    totalCostBeforeMargin: number;
    marginAmount: number;
    totalPrice: number;
    profitPercentage: number;
  }>({
    laborCost: 0,
    subcontractorCost: 0,
    totalHours: 0,
    overheadCost: 0,
    costBeforeMargin: 0,
    totalCostBeforeMargin: 0,
    marginAmount: 0,
    totalPrice: 0,
    profitPercentage: 0
  });
  
  useEffect(() => {
    if (!shifts.length && !subcontractors.length) return;
    
    const laborCost = calculateTotalCosts(shifts);
    const totalHours = calculateTotalHours(shifts);
    const subcontractorCost = calculateSubcontractorMonthlyCost(subcontractors);
    
    const costCalculation = calculateTotalCostWithOverheadAndMargin(
      laborCost,
      overheadPercentage,
      marginPercentage
    );
    
    const costBeforeMargin = costCalculation.totalCostBeforeMargin + subcontractorCost;
    const totalPrice = costCalculation.totalPrice + subcontractorCost;
    
    const profitPercentage = (costCalculation.marginAmount / costBeforeMargin) * 100;
    
    setSummary({
      laborCost,
      subcontractorCost,
      totalHours,
      overheadCost: costCalculation.overheadCost,
      costBeforeMargin,
      totalCostBeforeMargin: costCalculation.totalCostBeforeMargin,
      marginAmount: costCalculation.marginAmount,
      totalPrice,
      profitPercentage
    });
  }, [shifts, subcontractors, overheadPercentage, marginPercentage]);
  
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {shifts.length === 0 && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Shifts Defined</AlertTitle>
            <AlertDescription>
              Add shifts to calculate labor costs and generate an accurate quote.
            </AlertDescription>
          </Alert>
        )}
        
        {shifts.length > 0 && summary.laborCost === 0 && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Zero Labor Cost</AlertTitle>
            <AlertDescription>
              Your shifts are not generating any labor costs. Check your shift details.
            </AlertDescription>
          </Alert>
        )}
        
        {subcontractors.length === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Subcontractors</AlertTitle>
            <AlertDescription>
              You haven't added any subcontractors to this quote.
            </AlertDescription>
          </Alert>
        )}
        
        {summary.totalPrice > 0 && (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Quote Ready</AlertTitle>
            <AlertDescription>
              Your quote is ready with a total monthly cost of {formatCurrency(summary.totalPrice)}.
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Labor Costs"
          value={formatCurrency(summary.laborCost)}
          description={`Total for ${shifts.length} shifts`}
          footer={summary.totalHours > 0 ? `${summary.totalHours.toFixed(2)} hours total` : ''}
        />
        
        <SummaryCard
          title="Subcontractor Costs"
          value={formatCurrency(summary.subcontractorCost)}
          description={`Total for ${subcontractors.length} subcontractors`}
        />
        
        <SummaryCard
          title="Overhead"
          value={formatCurrency(summary.overheadCost)}
          description={`${overheadPercentage}% of labor costs`}
        />
        
        <SummaryCard
          title="Cost Before Margin"
          value={formatCurrency(summary.costBeforeMargin)}
          description="Labor + Overhead + Subcontractors"
        />
        
        <SummaryCard
          title="Profit Margin"
          value={formatCurrency(summary.marginAmount)}
          description={`${marginPercentage}% margin (${summary.profitPercentage.toFixed(2)}% of total)}`}
        />
        
        <SummaryCard
          title="Total Monthly Price"
          value={formatCurrency(summary.totalPrice)}
          description="Final price including all costs"
          highlight
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Labor Costs (Monthly)</span>
              <span>{formatCurrency(summary.laborCost)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Subcontractor Costs (Monthly)</span>
              <span>{formatCurrency(summary.subcontractorCost)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Overhead ({overheadPercentage}%)</span>
              <span>{formatCurrency(summary.overheadCost)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Cost Before Margin</span>
              <span>{formatCurrency(summary.costBeforeMargin)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Margin ({marginPercentage}%)</span>
              <span>{formatCurrency(summary.marginAmount)}</span>
            </div>
            
            <div className="flex justify-between py-2 font-bold">
              <span>Total Monthly Price</span>
              <span>{formatCurrency(summary.totalPrice)}</span>
            </div>
            
            <div className="flex justify-between py-2 text-sm text-muted-foreground">
              <span>Profit Percentage</span>
              <span>{summary.profitPercentage.toFixed(2)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  footer?: string;
  highlight?: boolean;
}

function SummaryCard({ title, value, description, footer, highlight }: SummaryCardProps) {
  return (
    <Card className={highlight ? "border-primary" : ""}>
      <CardContent className="p-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className={`text-2xl font-bold ${highlight ? "text-primary" : ""}`}>{value}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
          {footer && <p className="text-xs text-muted-foreground mt-4">{footer}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

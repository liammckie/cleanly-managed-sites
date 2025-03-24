
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QuoteShift, Subcontractor } from '@/lib/award/types';
import { BarChart4, DollarSign, TrendingUp } from 'lucide-react';

interface QuoteSummaryProps {
  shifts: QuoteShift[];
  subcontractors: Subcontractor[];
  overheadPercentage: number;
  marginPercentage: number;
  quoteId?: string | null;
}

export function QuoteSummary({ 
  shifts, 
  subcontractors,
  overheadPercentage,
  marginPercentage,
  quoteId
}: QuoteSummaryProps) {
  // Calculate shift costs
  const laborCost = useMemo(() => {
    return shifts.reduce((sum, shift) => sum + shift.estimatedCost, 0);
  }, [shifts]);
  
  // Calculate subcontractor costs with frequency adjustment
  const subcontractorCost = useMemo(() => {
    return subcontractors.reduce((sum, sub) => {
      let weeklyCost = 0;
      
      switch (sub.frequency) {
        case 'daily':
          weeklyCost = sub.cost * 7;
          break;
        case 'weekly':
          weeklyCost = sub.cost;
          break;
        case 'fortnightly':
          weeklyCost = sub.cost / 2;
          break;
        case 'monthly':
          weeklyCost = sub.cost / 4.33;
          break;
      }
      
      return sum + (weeklyCost * 4.33); // Monthly cost
    }, 0);
  }, [subcontractors]);
  
  // Calculate overhead
  const overheadCost = useMemo(() => {
    return (laborCost * overheadPercentage) / 100;
  }, [laborCost, overheadPercentage]);
  
  // Calculate total cost before margin
  const totalCostBeforeMargin = useMemo(() => {
    return laborCost + subcontractorCost + overheadCost;
  }, [laborCost, subcontractorCost, overheadCost]);
  
  // Calculate margin
  const marginAmount = useMemo(() => {
    return (totalCostBeforeMargin * marginPercentage) / 100;
  }, [totalCostBeforeMargin, marginPercentage]);
  
  // Calculate total price
  const totalPrice = useMemo(() => {
    return totalCostBeforeMargin + marginAmount;
  }, [totalCostBeforeMargin, marginAmount]);
  
  // Calculate profit percentage
  const profitPercentage = useMemo(() => {
    if (totalPrice === 0) return 0;
    return (marginAmount / totalPrice) * 100;
  }, [marginAmount, totalPrice]);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Labor Cost:</span>
              <span className="font-medium">${laborCost.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subcontractor Cost:</span>
              <span className="font-medium">${subcontractorCost.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Overhead ({overheadPercentage}%):
              </span>
              <span className="font-medium">${overheadCost.toFixed(2)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Cost:</span>
              <span className="font-medium">${totalCostBeforeMargin.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Margin ({marginPercentage}%):
              </span>
              <span className="font-medium">${marginAmount.toFixed(2)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total Price:</span>
              <span className="font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Profit Percentage:
              </span>
              <span className={`font-medium ${profitPercentage >= 15 ? 'text-green-600' : 'text-orange-500'}`}>
                {profitPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <DollarSign className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-lg font-bold">
                ${(totalPrice / 4.33).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">Weekly</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <DollarSign className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">Monthly</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <DollarSign className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-lg font-bold">
                ${(totalPrice * 12).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">Annual</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {shifts.length === 0 && subcontractors.length === 0 && (
        <div className="text-center p-6 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            Add shifts or subcontractors to see cost calculation
          </p>
        </div>
      )}
    </div>
  );
}

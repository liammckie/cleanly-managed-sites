
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QuoteShift, Subcontractor } from '@/lib/award/types';
import { 
  calculateHourDifference, 
  calculateTotalCostWithOverheadAndMargin,
  calculateSubcontractorMonthlyCost,
  formatCurrency,
  getTimeframeFactor,
  calculateDaysPerWeek
} from '@/lib/award/utils';
import { useAwardSettings } from '@/hooks/useAwardSettings';
import { 
  DownloadIcon, 
  FileText, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  PrinterIcon, 
  InfoIcon 
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Calculate shift hours
const calculateShiftHours = (shift: QuoteShift): number => {
  return calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration);
};

interface QuoteSummaryProps {
  quoteId: string | null;
  shifts: QuoteShift[];
  subcontractors: Subcontractor[];
  overheadPercentage: number;
  marginPercentage: number;
}

export function QuoteSummary({ 
  quoteId, 
  shifts, 
  subcontractors, 
  overheadPercentage: initialOverheadPercentage, 
  marginPercentage: initialMarginPercentage 
}: QuoteSummaryProps) {
  const [overheadPercentage, setOverheadPercentage] = useState(initialOverheadPercentage);
  const [marginPercentage, setMarginPercentage] = useState(initialMarginPercentage);
  const [activeTimeframe, setActiveTimeframe] = useState<'weekly' | 'monthly' | 'annual'>('monthly');
  const [applyOverheadToSubcontractors, setApplyOverheadToSubcontractors] = useState(false);
  const { settings } = useAwardSettings();
  
  // Update when props change
  useEffect(() => {
    setOverheadPercentage(initialOverheadPercentage);
    setMarginPercentage(initialMarginPercentage);
  }, [initialOverheadPercentage, initialMarginPercentage]);
  
  // Calculate total labor cost
  const totalLaborCost = shifts.reduce((total, shift) => total + shift.estimatedCost, 0);
  
  // Calculate total subcontractor cost (monthly)
  const totalSubcontractorMonthlyCost = subcontractors.reduce(
    (total, subcontractor) => total + calculateSubcontractorMonthlyCost(subcontractor),
    0
  );
  
  // Calculate total hours
  const totalHours = shifts.reduce((total, shift) => {
    const shiftHours = calculateShiftHours(shift);
    return total + (shiftHours * shift.numberOfCleaners);
  }, 0);
  
  // Calculate unique days per week
  const daysPerWeek = calculateDaysPerWeek(shifts);
  
  // Calculate costs based on timeframe
  const timeframeFactor = getTimeframeFactor(activeTimeframe);
  const displayLaborCost = totalLaborCost * timeframeFactor;
  
  let displaySubcontractorCost: number;
  switch (activeTimeframe) {
    case 'weekly':
      displaySubcontractorCost = totalSubcontractorMonthlyCost / 4.33;
      break;
    case 'monthly':
      displaySubcontractorCost = totalSubcontractorMonthlyCost;
      break;
    case 'annual':
      displaySubcontractorCost = totalSubcontractorMonthlyCost * 12;
      break;
    default:
      displaySubcontractorCost = totalSubcontractorMonthlyCost;
  }
  
  // Use the enhanced calculation utility
  const costSummary = calculateTotalCostWithOverheadAndMargin(
    displayLaborCost,
    displaySubcontractorCost,
    overheadPercentage,
    marginPercentage,
    applyOverheadToSubcontractors
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Quote Summary</h3>
          <p className="text-sm text-muted-foreground">
            Review costs, overhead, margin, and total price
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Tabs value={activeTimeframe} onValueChange={(v) => setActiveTimeframe(v as any)}>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annual">Annual</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="icon">
            <PrinterIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          {/* Cost Breakdown Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Cost Breakdown
              </CardTitle>
              <CardDescription>
                Detailed breakdown of all costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Labor Cost</div>
                      <div className="text-xs text-muted-foreground">
                        {totalHours.toFixed(1)} hours {activeTimeframe === 'weekly' ? 'per week' : activeTimeframe === 'monthly' ? 'per month' : 'per year'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(costSummary.laborCost)}</TableCell>
                    <TableCell className="text-right">
                      {costSummary.totalPrice > 0 ? ((costSummary.laborCost / costSummary.totalPrice) * 100).toFixed(1) : 0}%
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Overhead</div>
                      <div className="text-xs text-muted-foreground">
                        {overheadPercentage}% of {applyOverheadToSubcontractors ? 'all costs' : 'labor cost only'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(costSummary.overheadCost)}</TableCell>
                    <TableCell className="text-right">
                      {costSummary.totalPrice > 0 ? ((costSummary.overheadCost / costSummary.totalPrice) * 100).toFixed(1) : 0}%
                    </TableCell>
                  </TableRow>
                  
                  {subcontractors.length > 0 && (
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Subcontractors</div>
                        <div className="text-xs text-muted-foreground">
                          {subcontractors.length} subcontractor{subcontractors.length !== 1 ? 's' : ''}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(costSummary.subcontractorCost)}</TableCell>
                      <TableCell className="text-right">
                        {costSummary.totalPrice > 0 ? ((costSummary.subcontractorCost / costSummary.totalPrice) * 100).toFixed(1) : 0}%
                      </TableCell>
                    </TableRow>
                  )}
                  
                  <TableRow>
                    <TableCell className="font-medium">Cost Before Margin</TableCell>
                    <TableCell className="text-right">{formatCurrency(costSummary.costBeforeMargin)}</TableCell>
                    <TableCell className="text-right">
                      {costSummary.totalPrice > 0 ? ((costSummary.costBeforeMargin / costSummary.totalPrice) * 100).toFixed(1) : 0}%
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Margin</div>
                      <div className="text-xs text-muted-foreground">
                        {marginPercentage}% of cost before margin
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(costSummary.marginAmount)}</TableCell>
                    <TableCell className="text-right">
                      {costSummary.totalPrice > 0 ? ((costSummary.marginAmount / costSummary.totalPrice) * 100).toFixed(1) : 0}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t">
              <div className="w-full flex justify-between items-center">
                <span className="font-bold text-lg">Total Price</span>
                <span className="font-bold text-lg">{formatCurrency(costSummary.totalPrice)}</span>
              </div>
            </CardFooter>
          </Card>
          
          {/* Shift Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Shift Summary
              </CardTitle>
              <CardDescription>
                Overview of all scheduled shifts ({daysPerWeek} days per week)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shifts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No shifts have been added to this quote yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts.map(shift => {
                      const shiftHours = calculateShiftHours(shift);
                      return (
                        <TableRow key={shift.id}>
                          <TableCell className="capitalize">
                            {shift.day}
                          </TableCell>
                          <TableCell>
                            {shift.startTime} - {shift.endTime}
                          </TableCell>
                          <TableCell>
                            {shift.numberOfCleaners} × Level {shift.level} {shift.employmentType.replace('-', ' ')}
                          </TableCell>
                          <TableCell className="text-right">
                            {(shiftHours * shift.numberOfCleaners).toFixed(1)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(shift.estimatedCost)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-4 space-y-6">
          {/* Pricing Summary Card */}
          <Card className="bg-gradient-to-br from-primary/30 via-primary/20 to-background">
            <CardHeader>
              <CardTitle>Pricing Summary</CardTitle>
              <CardDescription>
                {activeTimeframe === 'weekly' ? 'Weekly' : activeTimeframe === 'monthly' ? 'Monthly' : 'Annual'} quote summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold">{formatCurrency(costSummary.totalPrice)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Total {activeTimeframe === 'weekly' ? 'Weekly' : activeTimeframe === 'monthly' ? 'Monthly' : 'Annual'} Price
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Labor & Overhead:</span>
                    <span>{formatCurrency(costSummary.laborCost + costSummary.overheadCost)}</span>
                  </div>
                  
                  {subcontractors.length > 0 && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subcontractors:</span>
                      <span>{formatCurrency(costSummary.subcontractorCost)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm mb-1">
                    <span>Profit:</span>
                    <span>{formatCurrency(costSummary.marginAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between font-medium">
                    <span>Profit Margin:</span>
                    <span>{costSummary.profitPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Margin & Overhead Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Settings</CardTitle>
              <CardDescription>
                Adjust overhead and margins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="overhead">Overhead Percentage: {overheadPercentage}%</Label>
                </div>
                <Slider
                  id="overhead"
                  min={0}
                  max={100}
                  step={1}
                  value={[overheadPercentage]}
                  onValueChange={(values) => setOverheadPercentage(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="apply-overhead"
                  checked={applyOverheadToSubcontractors}
                  onCheckedChange={setApplyOverheadToSubcontractors}
                />
                <Label htmlFor="apply-overhead" className="cursor-pointer">
                  Apply overhead to subcontractors
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        When enabled, overhead percentage will be applied to both labor and subcontractor costs.
                        When disabled, overhead is only calculated on labor costs.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="margin">Margin Percentage: {marginPercentage}%</Label>
                </div>
                <Slider
                  id="margin"
                  min={0}
                  max={100}
                  step={1}
                  value={[marginPercentage]}
                  onValueChange={(values) => setMarginPercentage(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Generate Quote Button */}
          <Button className="w-full" size="lg">
            <FileText className="h-4 w-4 mr-2" />
            Generate Quote PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

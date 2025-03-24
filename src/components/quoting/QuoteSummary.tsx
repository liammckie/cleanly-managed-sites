
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
  calculateDaysPerWeek,
  calculateTotalCosts,
  detectBrokenShifts
} from '@/lib/award/utils';
import { useAwardSettings } from '@/hooks/useAwardSettings';
import { 
  DownloadIcon, 
  FileText, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  PrinterIcon, 
  InfoIcon,
  PieChart,
  Calculator
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
  const [consumablesPerHour, setConsumablesPerHour] = useState(1.5);
  const [equipmentPerHour, setEquipmentPerHour] = useState(1.0);
  const { settings } = useAwardSettings();
  
  // Update when props change
  useEffect(() => {
    setOverheadPercentage(initialOverheadPercentage);
    setMarginPercentage(initialMarginPercentage);
  }, [initialOverheadPercentage, initialMarginPercentage]);
  
  // Calculate costs for the current timeframe
  const costs = calculateTotalCosts(shifts, subcontractors, activeTimeframe);
  
  // Calculate additional overhead costs for consumables and equipment
  const totalHours = costs.totalHours;
  const consumablesCost = totalHours * consumablesPerHour;
  const equipmentCost = totalHours * equipmentPerHour;
  const additionalOverheadCost = consumablesCost + equipmentCost;
  
  // Detect broken shifts
  const brokenShiftDays = detectBrokenShifts(shifts);
  const hasBrokenShifts = brokenShiftDays.length > 0;
  
  // Calculate days per week
  const daysPerWeek = calculateDaysPerWeek(shifts);
  
  // Use the enhanced calculation utility
  const costSummary = calculateTotalCostWithOverheadAndMargin(
    costs.laborCost,
    costs.subcontractorCost,
    overheadPercentage,
    marginPercentage,
    applyOverheadToSubcontractors
  );
  
  // Adjust cost summary to include additional overhead costs
  const adjustedCostSummary = {
    ...costSummary,
    overheadCost: costSummary.overheadCost + additionalOverheadCost,
    costBeforeMargin: costSummary.costBeforeMargin + additionalOverheadCost,
  };
  
  // Recalculate margin and total price
  adjustedCostSummary.marginAmount = (adjustedCostSummary.costBeforeMargin * marginPercentage) / 100;
  adjustedCostSummary.totalPrice = adjustedCostSummary.costBeforeMargin + adjustedCostSummary.marginAmount;
  
  // Calculate profit percentage
  adjustedCostSummary.profitPercentage = adjustedCostSummary.totalPrice > 0 
    ? ((adjustedCostSummary.marginAmount) / adjustedCostSummary.totalPrice) * 100 
    : 0;
  
  // Calculate percentages for the cost breakdown chart
  const laborPercentage = adjustedCostSummary.totalPrice > 0 
    ? (adjustedCostSummary.laborCost / adjustedCostSummary.totalPrice) * 100 
    : 0;
  
  const overheadPercentageOfTotal = adjustedCostSummary.totalPrice > 0 
    ? (adjustedCostSummary.overheadCost / adjustedCostSummary.totalPrice) * 100 
    : 0;
  
  const subcontractorPercentage = adjustedCostSummary.totalPrice > 0 
    ? (adjustedCostSummary.subcontractorCost / adjustedCostSummary.totalPrice) * 100 
    : 0;
  
  const marginPercentageOfTotal = adjustedCostSummary.totalPrice > 0 
    ? (adjustedCostSummary.marginAmount / adjustedCostSummary.totalPrice) * 100 
    : 0;
  
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
                    <TableCell className="text-right">{formatCurrency(adjustedCostSummary.laborCost)}</TableCell>
                    <TableCell className="text-right">
                      {laborPercentage.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Overhead</div>
                      <div className="text-xs text-muted-foreground">
                        <div>{overheadPercentage}% of {applyOverheadToSubcontractors ? 'all costs' : 'labor cost only'}</div>
                        <div>+ ${consumablesPerHour}/hr consumables, ${equipmentPerHour}/hr equipment</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(adjustedCostSummary.overheadCost)}</TableCell>
                    <TableCell className="text-right">
                      {overheadPercentageOfTotal.toFixed(1)}%
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
                      <TableCell className="text-right">{formatCurrency(adjustedCostSummary.subcontractorCost)}</TableCell>
                      <TableCell className="text-right">
                        {subcontractorPercentage.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  )}
                  
                  <TableRow>
                    <TableCell className="font-medium">Cost Before Margin</TableCell>
                    <TableCell className="text-right">{formatCurrency(adjustedCostSummary.costBeforeMargin)}</TableCell>
                    <TableCell className="text-right">
                      {((adjustedCostSummary.costBeforeMargin / adjustedCostSummary.totalPrice) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Margin</div>
                      <div className="text-xs text-muted-foreground">
                        {marginPercentage}% of cost before margin
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(adjustedCostSummary.marginAmount)}</TableCell>
                    <TableCell className="text-right">
                      {marginPercentageOfTotal.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t">
              <div className="w-full flex justify-between items-center">
                <span className="font-bold text-lg">Total Price</span>
                <span className="font-bold text-lg">{formatCurrency(adjustedCostSummary.totalPrice)}</span>
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
                            {brokenShiftDays.includes(shift.day) && (
                              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">Broken Shift</Badge>
                            )}
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
                <div className="text-4xl font-bold">{formatCurrency(adjustedCostSummary.totalPrice)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Total {activeTimeframe === 'weekly' ? 'Weekly' : activeTimeframe === 'monthly' ? 'Monthly' : 'Annual'} Price
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Labor:</span>
                    <span>{formatCurrency(adjustedCostSummary.laborCost)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overhead & Supplies:</span>
                    <span>{formatCurrency(adjustedCostSummary.overheadCost)}</span>
                  </div>
                  
                  {subcontractors.length > 0 && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subcontractors:</span>
                      <span>{formatCurrency(adjustedCostSummary.subcontractorCost)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm mb-1">
                    <span>Profit:</span>
                    <span>{formatCurrency(adjustedCostSummary.marginAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between font-medium">
                    <span>Profit Margin:</span>
                    <span>{adjustedCostSummary.profitPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              {/* Visual cost breakdown */}
              <div className="mt-4">
                <div className="text-sm font-medium mb-2 flex items-center">
                  <PieChart className="h-4 w-4 mr-1" />
                  <span>Cost Breakdown</span>
                </div>
                <div className="h-4 w-full rounded-full overflow-hidden flex">
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${laborPercentage}%` }}
                    title={`Labor: ${laborPercentage.toFixed(1)}%`}
                  />
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${overheadPercentageOfTotal}%` }}
                    title={`Overhead: ${overheadPercentageOfTotal.toFixed(1)}%`}
                  />
                  <div 
                    className="bg-orange-500" 
                    style={{ width: `${subcontractorPercentage}%` }}
                    title={`Subcontractors: ${subcontractorPercentage.toFixed(1)}%`}
                  />
                  <div 
                    className="bg-purple-500" 
                    style={{ width: `${marginPercentageOfTotal}%` }}
                    title={`Margin: ${marginPercentageOfTotal.toFixed(1)}%`}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-1"></span> Labor</span>
                  <span className="flex items-center"><span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span> Overhead</span>
                  <span className="flex items-center"><span className="h-2 w-2 bg-purple-500 rounded-full mr-1"></span> Profit</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Margin & Overhead Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Quote Settings
              </CardTitle>
              <CardDescription>
                Adjust overhead and margins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="overhead">Overhead: {overheadPercentage}%</Label>
                </div>
                <Slider
                  id="overhead"
                  min={0}
                  max={50}
                  step={0.5}
                  value={[overheadPercentage]}
                  onValueChange={(values) => setOverheadPercentage(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Consumables & Equipment</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="consumables" className="text-xs">Consumables</Label>
                      <span className="text-xs">${consumablesPerHour.toFixed(2)}/hr</span>
                    </div>
                    <Slider
                      id="consumables"
                      min={0}
                      max={5}
                      step={0.25}
                      value={[consumablesPerHour]}
                      onValueChange={(values) => setConsumablesPerHour(values[0])}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="equipment" className="text-xs">Equipment</Label>
                      <span className="text-xs">${equipmentPerHour.toFixed(2)}/hr</span>
                    </div>
                    <Slider
                      id="equipment"
                      min={0}
                      max={5}
                      step={0.25}
                      value={[equipmentPerHour]}
                      onValueChange={(values) => setEquipmentPerHour(values[0])}
                    />
                  </div>
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
                  <Label htmlFor="margin">Margin: {marginPercentage}%</Label>
                </div>
                <Slider
                  id="margin"
                  min={0}
                  max={50}
                  step={0.5}
                  value={[marginPercentage]}
                  onValueChange={(values) => setMarginPercentage(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
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

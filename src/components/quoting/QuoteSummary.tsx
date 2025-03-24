
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart, 
  DollarSign, 
  Download, 
  FileText, 
  Printer 
} from 'lucide-react';

interface QuoteSummaryProps {
  quoteId: string | null;
}

export function QuoteSummary({ quoteId }: QuoteSummaryProps) {
  // Sample data
  const costBreakdown = {
    labor: 1250.75,
    supplies: 175.50,
    equipment: 85.30,
    overhead: 226.73,
    margin: 347.66,
    total: 2085.94
  };

  const weeklyTotal = costBreakdown.total;
  const monthlyTotal = weeklyTotal * 4.33;
  const annualTotal = weeklyTotal * 52;

  // For demo only - if no quote is selected
  if (!quoteId) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Quote Selected</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Select or create a quote first, then add shifts to see a cost breakdown and summary here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quote Summary</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Weekly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${weeklyTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Monthly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Annual Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${annualTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Labor</TableCell>
                <TableCell className="text-right">${costBreakdown.labor.toFixed(2)}</TableCell>
                <TableCell className="text-right">{((costBreakdown.labor / costBreakdown.total) * 100).toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Supplies</TableCell>
                <TableCell className="text-right">${costBreakdown.supplies.toFixed(2)}</TableCell>
                <TableCell className="text-right">{((costBreakdown.supplies / costBreakdown.total) * 100).toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Equipment</TableCell>
                <TableCell className="text-right">${costBreakdown.equipment.toFixed(2)}</TableCell>
                <TableCell className="text-right">{((costBreakdown.equipment / costBreakdown.total) * 100).toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Overhead</TableCell>
                <TableCell className="text-right">${costBreakdown.overhead.toFixed(2)}</TableCell>
                <TableCell className="text-right">{((costBreakdown.overhead / costBreakdown.total) * 100).toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Margin</TableCell>
                <TableCell className="text-right">${costBreakdown.margin.toFixed(2)}</TableCell>
                <TableCell className="text-right">{((costBreakdown.margin / costBreakdown.total) * 100).toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">${costBreakdown.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">100.0%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Profitability Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Gross Profit</div>
              <div className="text-xl font-bold">${(costBreakdown.margin + costBreakdown.overhead).toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">
                {(((costBreakdown.margin + costBreakdown.overhead) / costBreakdown.total) * 100).toFixed(1)}% of total
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Net Profit</div>
              <div className="text-xl font-bold">${costBreakdown.margin.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">
                {((costBreakdown.margin / costBreakdown.total) * 100).toFixed(1)}% of total
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Profit per Hour</div>
              <div className="text-xl font-bold">$12.73</div>
              <div className="text-sm text-muted-foreground">
                Based on 27.3 hours per week
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button>Generate Final Quote</Button>
      </div>
    </div>
  );
}

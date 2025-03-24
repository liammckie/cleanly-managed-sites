
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cleaningServicesAward } from '@/lib/award/awardData';
import { PayCondition, EmploymentType, EmployeeLevel, EmployeeLevelRates } from '@/lib/award/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAwardSettings } from '@/hooks/useAwardSettings';
import { format } from 'date-fns';

const payConditionLabels: Record<PayCondition, string> = {
  'base': 'Regular Hours (Mon-Fri)',
  'shift-early-late': 'Early/Late Shift',
  'saturday': 'Saturday',
  'sunday': 'Sunday',
  'public-holiday': 'Public Holiday',
  'overtime-first-2-hours': 'Overtime (First 2 Hours)',
  'overtime-after-2-hours': 'Overtime (After 2 Hours)',
  'overtime-sunday': 'Sunday Overtime',
  'overtime-public-holiday': 'Public Holiday Overtime'
};

export function AwardRatesTable() {
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full-time');
  const { settings } = useAwardSettings();
  
  // Get the rates for the selected employment type
  const rates = cleaningServicesAward.levels.filter(level => level.employmentType === employmentType);
  
  // Apply the settings multiplier to the rates
  const adjustedRates = rates.map(levelRates => {
    const adjustedLevel = { ...levelRates };
    adjustedLevel.baseRate = adjustedLevel.baseRate * settings.baseRateMultiplier;
    
    Object.keys(adjustedLevel.rates).forEach(conditionKey => {
      const condition = conditionKey as PayCondition;
      adjustedLevel.rates[condition] = {
        ...adjustedLevel.rates[condition],
        rate: adjustedLevel.rates[condition].rate * settings.baseRateMultiplier
      };
    });
    
    return adjustedLevel;
  });
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cleaning Services Award Rates</CardTitle>
        <CardDescription>
          MA000022 - Effective {format(new Date(cleaningServicesAward.effectiveDate), 'PPP')}
          {settings.baseRateMultiplier !== 1.0 && ` (adjusted by ${settings.baseRateMultiplier.toFixed(2)}x multiplier)`}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={employmentType} onValueChange={(value) => setEmploymentType(value as EmploymentType)}>
          <TabsList className="mb-4">
            <TabsTrigger value="full-time">Full-time</TabsTrigger>
            <TabsTrigger value="part-time">Part-time</TabsTrigger>
            <TabsTrigger value="casual">Casual</TabsTrigger>
          </TabsList>
          
          <TabsContent value={employmentType}>
            <div className="border rounded-md overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pay Condition</TableHead>
                    {adjustedRates.map((level, index) => (
                      <TableHead key={index} className="text-right">Level {level.level}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(payConditionLabels).map(([condition, label]) => (
                    <TableRow key={condition}>
                      <TableCell className="font-medium">{label}</TableCell>
                      {adjustedRates.map((level, index) => (
                        <TableCell key={index} className="text-right">
                          ${level.rates[condition as PayCondition].rate.toFixed(2)}
                          <span className="block text-xs text-muted-foreground">
                            ({level.rates[condition as PayCondition].multiplier.toFixed(2)}x)
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

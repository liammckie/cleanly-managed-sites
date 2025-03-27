
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { awardData } from '@/lib/award/awardData';
import { PayCondition } from '@/lib/award/types';

const payConditionLabels: Record<string, string> = {
  base: 'Base Rate',
  overtime_1_5: 'Overtime (1.5x)',
  overtime_2: 'Overtime (2x)',
  saturday: 'Saturday',
  sunday: 'Sunday',
  public_holiday: 'Public Holiday',
  early_morning: 'Early Morning',
  evening: 'Evening',
  night: 'Night Shift',
  shift_allowance: 'Shift Allowance',
  meal_allowance: 'Meal Allowance'
};

export function AwardRatesTable() {
  const levelRates = awardData.employeeLevelRates;
  
  // Extract rates for all employee levels
  const levels = Object.keys(levelRates).filter(level => level !== 'contractor');
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Condition</TableHead>
            {levels.map(level => (
              <TableHead key={level}>Level {level}</TableHead>
            ))}
            <TableHead>Multiplier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(payConditionLabels).map(condition => {
            const payCondition = condition as PayCondition;
            const rateDefinition = awardData.conditionRates[payCondition];
            
            return (
              <TableRow key={condition}>
                <TableCell className="font-medium">{payConditionLabels[condition]}</TableCell>
                
                {levels.map(level => {
                  const baseRate = levelRates[level].base;
                  const multiplier = rateDefinition.percentage / 100;
                  const rate = baseRate * multiplier;
                  
                  return (
                    <TableCell key={`${condition}-${level}`}>
                      ${rate.toFixed(2)}
                    </TableCell>
                  );
                })}
                
                <TableCell>{(rateDefinition.percentage / 100).toFixed(2)}x</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

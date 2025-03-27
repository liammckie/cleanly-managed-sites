
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { awardData } from '@/lib/award/awardData';
import { PayCondition } from '@/lib/award/types';

const payConditionLabels: Record<string, string> = {
  base: 'Base Rate',
  saturday: 'Saturday',
  sunday: 'Sunday',
  publicHoliday: 'Public Holiday',
  earlyMorning: 'Early Morning',
  evening: 'Evening',
  overnight: 'Night Shift',
  overtime1: 'Overtime (1.5x)',
  overtime2: 'Overtime (2x)',
  overtime3: 'Overtime (Public Holiday)',
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
                  const baseRate = levelRates[level];
                  const multiplier = rateDefinition;
                  const rate = baseRate * multiplier;
                  
                  return (
                    <TableCell key={`${condition}-${level}`}>
                      ${rate.toFixed(2)}
                    </TableCell>
                  );
                })}
                
                <TableCell>{rateDefinition.toFixed(2)}x</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

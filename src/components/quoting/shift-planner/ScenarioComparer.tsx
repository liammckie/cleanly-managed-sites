
import React, { useState } from 'react';
import { QuoteShift } from '@/lib/types/award/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateShiftCost } from '@/lib/utils/calculationUtils';

export interface ScenarioComparerProps {
  shift: QuoteShift;
  onApplyScenario: (updatedShift: QuoteShift) => void;
}

export function ScenarioComparer({ shift, onApplyScenario }: ScenarioComparerProps) {
  const [scenarios, setScenarios] = useState([
    {
      id: '1',
      name: 'Increase rate by 5%',
      costModifier: 1.05,
    },
    {
      id: '2',
      name: 'Add additional cleaner',
      cleanerModifier: 1,
    },
    {
      id: '3',
      name: 'Extend shift by 30 min',
      timeModifier: 30,
    },
  ]);

  const applyScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    const updatedShift = { ...shift };

    if (scenario.costModifier) {
      // Apply cost modifier (dummy calculation for now)
      updatedShift.estimatedCost = calculateShiftCost(updatedShift, {}) * scenario.costModifier;
    }

    if (scenario.cleanerModifier) {
      // Add additional cleaners
      updatedShift.numberOfCleaners += scenario.cleanerModifier;
      updatedShift.estimatedCost = calculateShiftCost(updatedShift, {});
    }

    if (scenario.timeModifier) {
      // Extend shift time (dummy implementation)
      // In a real app we would parse the time and add minutes
      updatedShift.estimatedCost = calculateShiftCost(updatedShift, {}) * 1.1;
    }

    onApplyScenario(updatedShift);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Scenario Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scenarios.map(scenario => (
            <div key={scenario.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{scenario.name}</p>
                <p className="text-sm text-muted-foreground">
                  Estimated cost: ${calculateShiftCost(shift, {}) * (scenario.costModifier || 1.1).toFixed(2)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyScenario(scenario.id)}
              >
                Apply
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

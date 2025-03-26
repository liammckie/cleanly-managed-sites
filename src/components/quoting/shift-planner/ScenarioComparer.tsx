import React, { useState } from 'react';
import { Scenario } from '@/lib/types/quoteTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateScenario } from '@/lib/utils/calculationUtils';

interface ScenarioComparerProps {
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
}

export function ScenarioComparer({ scenarios, onSelectScenario }: ScenarioComparerProps) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  
  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    onSelectScenario(scenario);
  };
  
  // Add a dummy second parameter to calculateScenario call to match expected type
  const calculateScenarioData = (scenario: Scenario) => {
    return calculateScenario(scenario, {});
  };
  
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Compare Scenarios</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => {
          const calculations = calculateScenarioData(scenario);
          
          return (
            <Card 
              key={index} 
              className={selectedScenario === scenario ? 'border-primary' : ''}
              onClick={() => handleScenarioSelect(scenario)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{scenario.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Hours:</span>
                    <span className="font-medium">{calculations.totalHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor Cost:</span>
                    <span className="font-medium">${calculations.laborCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-medium">${calculations.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Revenue:</span>
                    <span className="font-medium">${calculations.weeklyRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Revenue:</span>
                    <span className="font-medium">${calculations.monthlyRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin:</span>
                    <span className="font-medium">{calculations.profitMargin.toFixed(1)}%</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4"
                  variant={selectedScenario === scenario ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScenarioSelect(scenario);
                  }}
                >
                  {selectedScenario === scenario ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

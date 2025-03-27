
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StepConfig } from './siteFormConfig';

interface FormStepGuidanceProps {
  step: StepConfig;
}

export const FormStepGuidance: React.FC<FormStepGuidanceProps> = ({ step }) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">{step.title}</h3>
        <p className="text-muted-foreground text-sm">{step.description}</p>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock } from 'lucide-react';

// Pre-built shift templates
const SHIFT_TEMPLATES = [
  { 
    name: "Standard 8hr Day", 
    startTime: "09:00", 
    endTime: "17:00", 
    breakDuration: 30,
    description: "Regular 8-hour shift with 30min break" 
  },
  { 
    name: "Early Morning 6hr", 
    startTime: "05:00", 
    endTime: "11:00", 
    breakDuration: 0,
    description: "Early morning 6-hour shift with no break" 
  },
  { 
    name: "Evening 4hr", 
    startTime: "18:00", 
    endTime: "22:00", 
    breakDuration: 0,
    description: "Evening 4-hour shift with no break" 
  },
  { 
    name: "Split Shift", 
    startTime: "06:00", 
    endTime: "10:00", 
    breakDuration: 0,
    description: "Morning portion of a split shift" 
  },
  { 
    name: "Weekend Half Day", 
    startTime: "08:00", 
    endTime: "12:00", 
    breakDuration: 0,
    description: "4-hour weekend morning shift" 
  }
];

interface ShiftTemplatesProps {
  onApplyTemplate: (template: typeof SHIFT_TEMPLATES[0]) => void;
  disabled?: boolean;
}

export function ShiftTemplates({ onApplyTemplate, disabled = false }: ShiftTemplatesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Quick Shift Templates
        </CardTitle>
        <CardDescription>
          Apply pre-built templates to quickly set up common shifts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {SHIFT_TEMPLATES.map((template, idx) => (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={disabled}
                    onClick={() => onApplyTemplate(template)}
                  >
                    {template.name}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-60">
                  <p className="text-sm">{template.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.startTime} - {template.endTime} ({template.breakDuration}min break)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

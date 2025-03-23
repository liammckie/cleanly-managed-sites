
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface PermissionCheckboxProps {
  id: string;
  label: string;
  description: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
}

export const PermissionCheckbox = ({
  id,
  label,
  description,
  checked,
  onCheckedChange
}: PermissionCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id} 
        checked={checked} 
        onCheckedChange={onCheckedChange}
      />
      <label htmlFor={id} className="text-sm font-medium cursor-pointer flex items-center">
        {label}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="max-w-xs text-sm">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </label>
    </div>
  );
};

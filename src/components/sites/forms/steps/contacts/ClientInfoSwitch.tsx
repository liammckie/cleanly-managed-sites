
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormItem } from '@/components/ui/form';

interface ClientInfoSwitchProps {
  useClientInfo: boolean;
  toggleUseClientInfo?: (value: boolean) => void;
}

export function ClientInfoSwitch({ useClientInfo, toggleUseClientInfo }: ClientInfoSwitchProps) {
  return (
    <FormItem className="flex items-center space-x-2">
      <Switch 
        id="useClientInfo" 
        checked={useClientInfo}
        onCheckedChange={(value) => {
          if (toggleUseClientInfo) {
            toggleUseClientInfo(value);
          }
        }}
      />
      <Label htmlFor="useClientInfo" className="cursor-pointer">
        Use client information for billing details
      </Label>
    </FormItem>
  );
}

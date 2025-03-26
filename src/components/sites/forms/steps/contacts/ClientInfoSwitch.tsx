
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';

interface ClientInfoSwitchProps {
  useClientInfo: boolean;
  toggleUseClientInfo?: (value: boolean) => void;
}

export function ClientInfoSwitch({ useClientInfo, toggleUseClientInfo }: ClientInfoSwitchProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="use-client-info" className="text-sm">
              Use client contact information for this site
            </Label>
          </div>
          <Switch 
            id="use-client-info" 
            checked={useClientInfo}
            onCheckedChange={toggleUseClientInfo}
          />
        </div>
      </CardContent>
    </Card>
  );
}

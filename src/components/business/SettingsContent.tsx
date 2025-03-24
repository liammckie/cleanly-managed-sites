
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export const BusinessSettingsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
          <CardDescription>Configure your business settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Settings className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground max-w-md">
              Configure your business details, branding, and preferences here.
            </p>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Edit Business Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

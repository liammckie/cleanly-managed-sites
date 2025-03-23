
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function PreferencesRedirect() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Preferences</CardTitle>
        <CardDescription>Customize your experience</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          User preferences can be found in the Settings page.
        </p>
        <div className="mt-4">
          <Button asChild>
            <Link to="/settings?tab=user">
              Go to User Preferences
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your account security</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Password</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Change your password to keep your account secure
            </p>
            <Button variant="outline">Change Password</Button>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">Setup 2FA</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

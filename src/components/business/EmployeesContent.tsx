
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface EmployeesContentProps {
  onEmployeesClick: () => void;
}

export const EmployeesContent: React.FC<EmployeesContentProps> = ({ onEmployeesClick }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Manage your business employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <p className="text-center text-muted-foreground max-w-md">
              Employee management is available on the dedicated Employees page. Click below to navigate to the full employee management system.
            </p>
            <Button onClick={onEmployeesClick}>
              <Users className="mr-2 h-4 w-4" />
              Go to Employees
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

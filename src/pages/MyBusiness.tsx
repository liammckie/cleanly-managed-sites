
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const MyBusiness = () => {
  return (
    <PageLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">My Business</h1>
        
        <EmployeesContent />
      </div>
    </PageLayout>
  );
};

// This code will be appended to the end of the existing file, right before the export default
const EmployeesContent = () => {
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
            <Button asChild>
              <a href="/employees">
                <Users className="mr-2 h-4 w-4" />
                Go to Employees
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBusiness;

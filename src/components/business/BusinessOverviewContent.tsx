
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Calculator } from 'lucide-react';

interface BusinessOverviewProps {
  locations: any[];
  onEmployeesClick: () => void;
  onAwardEngineClick: () => void;
}

export const BusinessOverviewContent: React.FC<BusinessOverviewProps> = ({ 
  locations, 
  onEmployeesClick, 
  onAwardEngineClick 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Summary</CardTitle>
          <CardDescription>Overview of your business operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Locations:</span>
              <span className="font-medium">{locations?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Locations:</span>
              <span className="font-medium">{locations?.filter(l => l.is_active)?.length || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Frequently used business functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="justify-start" onClick={onEmployeesClick}>
              <Users className="mr-2 h-4 w-4" />
              Manage Employees
            </Button>
            <Button variant="outline" className="justify-start" onClick={onAwardEngineClick}>
              <Calculator className="mr-2 h-4 w-4" />
              Award Engine & Cost Calculator
            </Button>
            <Button variant="outline" className="justify-start">
              <Building2 className="mr-2 h-4 w-4" />
              Add New Location
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

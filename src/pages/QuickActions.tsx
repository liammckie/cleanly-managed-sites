
import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Quick Actions</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer hover:border-primary" onClick={() => navigate('/clients/create')}>
            <CardHeader>
              <CardTitle>New Client</CardTitle>
              <CardDescription>Create a new client record</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Add a new client to your system with contact details.</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:border-primary" onClick={() => navigate('/sites/create')}>
            <CardHeader>
              <CardTitle>New Site</CardTitle>
              <CardDescription>Create a new site location</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Add a new site with all required specifications and details.</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:border-primary" onClick={() => navigate('/workorders/create')}>
            <CardHeader>
              <CardTitle>New Work Order</CardTitle>
              <CardDescription>Create a new service work order</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Schedule and track a new service work order.</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:border-primary" onClick={() => navigate('/contacts/create')}>
            <CardHeader>
              <CardTitle>New Contact</CardTitle>
              <CardDescription>Create a new contact record</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Add a new contact for clients or sites.</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:border-primary" onClick={() => navigate('/contractors/create')}>
            <CardHeader>
              <CardTitle>New Contractor</CardTitle>
              <CardDescription>Create a new contractor record</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Add a new contractor with services offered.</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:border-primary" onClick={() => navigate('/contracts/create')}>
            <CardHeader>
              <CardTitle>New Contract</CardTitle>
              <CardDescription>Create a new service contract</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Set up a new contract with terms and billing details.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default QuickActions;

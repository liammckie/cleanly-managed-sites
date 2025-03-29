
import React from 'react';
import ContractActivityFeed from './ContractActivityFeed';
import { useContractActivities } from '@/hooks/useContractActivities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ContractActivity } from '@/types/models';

export function ContractActivityPage() {
  const { activities, isLoading, error } = useContractActivities({ limit: 10 });
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Contract Activity Feed</h1>
        <p className="text-muted-foreground">Track and monitor contract changes and updates</p>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="py-10">
                <p className="text-center text-muted-foreground">Loading activities...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-10">
                <p className="text-center text-red-500">Error loading activities: {error.message}</p>
              </CardContent>
            </Card>
          ) : (
            <ContractActivityFeed 
              activities={activities as ContractActivity[]}
              title="All Contract Activities"
              description="Complete history of contract changes and updates"
            />
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          <ContractActivityFeed 
            activities={activities.slice(0, 5) as ContractActivity[]}
            title="Recent Activities"
            description="Activities from the last 7 days"
          />
        </TabsContent>
        
        <TabsContent value="important">
          <ContractActivityFeed 
            activities={activities.filter(a => a.action === 'created' || a.action === 'renewed') as ContractActivity[]}
            title="Important Activities"
            description="Critical contract events requiring attention"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ContractActivityPage;

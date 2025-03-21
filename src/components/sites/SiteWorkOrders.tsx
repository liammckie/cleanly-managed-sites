
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkOrdersList } from '@/components/workorders/WorkOrdersList';
import { SiteRecord } from '@/lib/types';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WorkOrderForm } from '@/components/workorders/WorkOrderForm';

interface SiteWorkOrdersProps {
  site: SiteRecord;
}

export const SiteWorkOrders = ({ site }: SiteWorkOrdersProps) => {
  const { useSiteWorkOrders } = useWorkOrders();
  const { data: workOrders = [], isLoading, error } = useSiteWorkOrders(site.id);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleWorkOrderCreated = () => {
    setCreateDialogOpen(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Work Orders</CardTitle>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Work Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Work Order for {site.name}</DialogTitle>
            </DialogHeader>
            <WorkOrderForm site={site} onSuccess={handleWorkOrderCreated} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-4">
        <WorkOrdersList 
          workOrders={workOrders} 
          isLoading={isLoading} 
          error={error as Error}
          showSiteInfo={false}
          limit={5}
        />
      </CardContent>
    </Card>
  );
};

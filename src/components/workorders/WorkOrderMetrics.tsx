
import React from 'react';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ClipboardCheck, DollarSign, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WorkOrderMetrics() {
  const { workOrders, isLoadingWorkOrders } = useWorkOrders();
  
  if (isLoadingWorkOrders) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Calculate metrics
  const totalAdHocJobs = workOrders.length;
  
  const completedJobs = workOrders.filter(wo => wo.status === 'completed').length;
  
  const totalBillingAmount = workOrders.reduce((total, wo) => 
    total + (wo.billing_amount || 0), 0);
  
  const pendingJobs = workOrders.filter(wo => 
    wo.status !== 'completed' && wo.status !== 'cancelled').length;
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Ad-Hoc Work Orders</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/work-orders">
          <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Ad-Hoc Jobs</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAdHocJobs}</div>
              <p className="text-xs text-muted-foreground">
                One-off work orders
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/work-orders?status=completed">
          <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedJobs}</div>
              <p className="text-xs text-muted-foreground">
                Finished work orders
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/work-orders?status=pending">
          <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingJobs}</div>
              <p className="text-xs text-muted-foreground">
                In progress or awaiting action
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Billing</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBillingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Revenue from ad-hoc jobs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

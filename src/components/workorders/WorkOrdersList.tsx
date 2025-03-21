
import React from 'react';
import { Link } from 'react-router-dom';
import { WorkOrderRecord } from '@/lib/api/workorders/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface WorkOrdersListProps {
  workOrders: WorkOrderRecord[];
  isLoading: boolean;
  error: Error | null;
  showSiteInfo?: boolean;
  limit?: number;
}

const statusConfig = {
  draft: { color: 'bg-gray-500 text-white', icon: FileText },
  pending_approval: { color: 'bg-blue-500 text-white', icon: Clock },
  approved: { color: 'bg-green-500 text-white', icon: CheckCircle },
  assigned: { color: 'bg-purple-500 text-white', icon: FileText },
  in_progress: { color: 'bg-yellow-500 text-white', icon: Clock },
  completed: { color: 'bg-emerald-500 text-white', icon: CheckCircle },
  invoiced: { color: 'bg-indigo-500 text-white', icon: FileText },
  paid: { color: 'bg-cyan-500 text-white', icon: CheckCircle },
  cancelled: { color: 'bg-red-500 text-white', icon: AlertCircle }
};

const priorityColors = {
  low: 'bg-slate-400',
  medium: 'bg-blue-400',
  high: 'bg-amber-500',
  urgent: 'bg-red-500'
};

export const WorkOrdersList = ({ 
  workOrders, 
  isLoading, 
  error, 
  showSiteInfo = false,
  limit
}: WorkOrdersListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>Failed to load work orders</p>
      </div>
    );
  }

  const displayWorkOrders = limit ? workOrders.slice(0, limit) : workOrders;

  if (displayWorkOrders.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No work orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayWorkOrders.map((workOrder) => {
        const StatusIcon = statusConfig[workOrder.status]?.icon || FileText;
        
        return (
          <Card key={workOrder.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-medium">{workOrder.title}</CardTitle>
                  {showSiteInfo && workOrder.site && (
                    <p className="text-sm text-muted-foreground">
                      Site: {workOrder.site.name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={statusConfig[workOrder.status]?.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {workOrder.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={priorityColors[workOrder.priority]}>
                    {workOrder.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-2 mb-3">{workOrder.description}</p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                {workOrder.due_date && (
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Due: {format(new Date(workOrder.due_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
                
                {workOrder.billing_amount && (
                  <div className="text-muted-foreground">
                    Billing: ${workOrder.billing_amount.toFixed(2)}
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <Link to={`/workorders/${workOrder.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {limit && workOrders.length > limit && (
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link to="/workorders">View All Work Orders</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

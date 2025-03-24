
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WorkOrderRecord } from '@/lib/api/workorders/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, AlertCircle, CheckCircle, Clock, User, Building, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { useSubcontractors } from '@/hooks/useSubcontractors';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  assigned: { color: 'bg-purple-500 text-white', icon: User },
  in_progress: { color: 'bg-yellow-500 text-white', icon: Clock },
  completed: { color: 'bg-emerald-500 text-white', icon: CheckCircle },
  invoiced: { color: 'bg-indigo-500 text-white', icon: FileText },
  paid: { color: 'bg-cyan-500 text-white', icon: DollarSign },
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = limit || 10;
  const { subcontractors = [] } = useSubcontractors(undefined);
  
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

  if (workOrders.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No work orders found</p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "—";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate profit margin
  const calculateProfitMargin = (billing: number | undefined, cost: number | undefined) => {
    if (!billing || !cost) return null;
    const margin = ((billing - cost) / billing * 100).toFixed(1);
    return parseFloat(margin);
  };

  // Handle pagination
  const totalPages = Math.ceil(workOrders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, workOrders.length);
  const paginatedOrders = limit ? workOrders.slice(0, limit) : workOrders.slice(startIndex, endIndex);

  // Find contractor name
  const getContractorName = (contractorId: string | undefined) => {
    if (!contractorId) return null;
    const contractor = subcontractors.find(c => c.id === contractorId);
    return contractor ? contractor.business_name : null;
  };

  return (
    <div className="space-y-4">
      {paginatedOrders.map((workOrder) => {
        const StatusIcon = statusConfig[workOrder.status]?.icon || FileText;
        const contractorName = getContractorName(workOrder.assigned_to);
        const profitMargin = calculateProfitMargin(
          workOrder.billing_amount, 
          workOrder.actual_cost || workOrder.estimated_cost
        );
        
        return (
          <Card key={workOrder.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <CardTitle className="text-lg font-medium mr-2">{workOrder.title}</CardTitle>
                    {workOrder.purchase_order_number && (
                      <Badge variant="outline" className="ml-2">
                        PO: {workOrder.purchase_order_number}
                      </Badge>
                    )}
                  </div>
                  {showSiteInfo && workOrder.site && (
                    <div className="text-sm text-muted-foreground flex items-center mt-1">
                      <Building className="h-3.5 w-3.5 mr-1 opacity-70" />
                      {workOrder.site.client_name && (
                        <>
                          <span>{workOrder.site.client_name}</span>
                          <span className="mx-1">•</span>
                        </>
                      )}
                      <span>{workOrder.site.name}</span>
                    </div>
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
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Due Date</span>
                  <span className="text-sm font-medium">
                    {workOrder.due_date ? format(new Date(workOrder.due_date), 'MMM d, yyyy') : '—'}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Assigned To</span>
                  <span className="text-sm font-medium">
                    {contractorName || '—'}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Client Charge</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(workOrder.billing_amount)}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Cost</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(workOrder.actual_cost || workOrder.estimated_cost)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center gap-3">
                  {profitMargin !== null && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Badge variant={profitMargin > 20 ? "success" : profitMargin > 10 ? "default" : "destructive"}>
                              {profitMargin}% margin
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            Billing: {formatCurrency(workOrder.billing_amount)}<br/>
                            Cost: {formatCurrency(workOrder.actual_cost || workOrder.estimated_cost)}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {workOrder.completion_date && (
                    <Badge variant="outline">
                      Completed: {format(new Date(workOrder.completion_date), 'MMM d, yyyy')}
                    </Badge>
                  )}
                  
                  {workOrder.xero_invoice_id && (
                    <Badge variant="outline" className="bg-blue-50">
                      Invoiced
                    </Badge>
                  )}
                </div>
                
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
      
      {!limit && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
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

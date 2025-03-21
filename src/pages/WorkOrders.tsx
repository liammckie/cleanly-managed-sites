
import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { WorkOrdersList } from '@/components/workorders/WorkOrdersList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { WorkOrderStatus, WorkOrderPriority } from '@/lib/api/workorders/types';
import { PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkOrders = () => {
  const { workOrders, isLoadingWorkOrders, workOrdersError, refetchWorkOrders } = useWorkOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority | 'all'>('all');

  const filteredWorkOrders = workOrders.filter(workOrder => {
    // Filter by search term
    const matchesSearch = 
      workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workOrder.site?.name && workOrder.site.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || workOrder.status === statusFilter;
    
    // Filter by priority
    const matchesPriority = priorityFilter === 'all' || workOrder.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Work Orders</h1>
                <Button asChild>
                  <Link to="/sites">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Work Order
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search work orders..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full md:w-2/3">
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value) => setStatusFilter(value as WorkOrderStatus | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending_approval">Pending Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="invoiced">Invoiced</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={priorityFilter} 
                    onValueChange={(value) => setPriorityFilter(value as WorkOrderPriority | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <WorkOrdersList 
                workOrders={filteredWorkOrders} 
                isLoading={isLoadingWorkOrders} 
                error={workOrdersError as Error}
                showSiteInfo={true}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WorkOrders;

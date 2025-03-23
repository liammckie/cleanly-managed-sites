
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
import { useSites } from '@/hooks/useSites';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NewWorkOrderDialog } from '@/components/workorders/NewWorkOrderDialog';
import { ViewToggle } from '@/components/ui/data-table/ViewToggle';
import { TabulatorView } from '@/components/ui/data-table/TabulatorView';

const WorkOrders = () => {
  const { workOrders, isLoadingWorkOrders, workOrdersError, refetchWorkOrders } = useWorkOrders();
  const { sites } = useSites();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority | 'all'>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'table'>('grid');

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

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  // Table columns for tabulator
  const tabulatorColumns = [
    { title: "Title", field: "title", headerFilter: true, sorter: "string", width: 200 },
    { 
      title: "Site", 
      field: "site.name", 
      headerFilter: true,
      formatter: (cell: any) => cell.getValue() || "—"
    },
    { 
      title: "Status", 
      field: "status", 
      headerFilter: "list", 
      headerFilterParams: { 
        values: { 
          draft: "Draft", 
          pending_approval: "Pending Approval", 
          approved: "Approved",
          assigned: "Assigned",
          in_progress: "In Progress",
          completed: "Completed",
          invoiced: "Invoiced",
          paid: "Paid",
          cancelled: "Cancelled"
        } 
      },
      formatter: "html",
      formatterParams: {
        html: (cell: any) => {
          const status = cell.getValue();
          let color = "bg-gray-100 text-gray-800";
          
          if (status === "completed") color = "bg-green-100 text-green-800";
          else if (status === "in_progress") color = "bg-blue-100 text-blue-800";
          else if (status === "pending_approval") color = "bg-yellow-100 text-yellow-800";
          else if (status === "cancelled") color = "bg-red-100 text-red-800";
          
          return `<span class="px-2 py-1 rounded-full text-xs font-medium ${color}">${status.replace('_', ' ')}</span>`;
        }
      }
    },
    { 
      title: "Priority", 
      field: "priority", 
      headerFilter: "list", 
      headerFilterParams: { values: { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" } },
      formatter: "html",
      formatterParams: {
        html: (cell: any) => {
          const priority = cell.getValue();
          let color = "bg-gray-100 text-gray-800";
          
          if (priority === "low") color = "bg-green-100 text-green-800";
          else if (priority === "medium") color = "bg-blue-100 text-blue-800";
          else if (priority === "high") color = "bg-yellow-100 text-yellow-800";
          else if (priority === "urgent") color = "bg-red-100 text-red-800";
          
          return `<span class="px-2 py-1 rounded-full text-xs font-medium ${color}">${priority}</span>`;
        }
      }
    },
    { 
      title: "Due Date", 
      field: "due_date", 
      sorter: "date",
      formatter: (cell: any) => formatDate(cell.getValue())
    },
    { 
      title: "Billing Amount", 
      field: "billing_amount", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      bottomCalc: "sum",
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2, symbol: "$" }
    },
    { 
      title: "Actions", 
      formatter: "html", 
      width: 120,
      formatterParams: {
        html: (cell: any) => `<a href="/work-orders/${cell.getData().id}" class="text-primary hover:underline">View</a>`
      }
    }
  ];

  const handleWorkOrderCreated = () => {
    setCreateDialogOpen(false);
    refetchWorkOrders();
  };

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
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Work Order
                </Button>
              </div>
              
              <div className="border border-border rounded-lg bg-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search work orders..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Select 
                      value={statusFilter} 
                      onValueChange={(value) => setStatusFilter(value as WorkOrderStatus | 'all')}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
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
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <ViewToggle view={view} onViewChange={setView} />
                  </div>
                </div>
              </div>
              
              {view === 'grid' ? (
                <WorkOrdersList 
                  workOrders={filteredWorkOrders} 
                  isLoading={isLoadingWorkOrders} 
                  error={workOrdersError as Error}
                  showSiteInfo={true}
                />
              ) : (
                <TabulatorView 
                  data={filteredWorkOrders}
                  columns={tabulatorColumns}
                  title="Work Orders"
                  initialSort={[{ column: "due_date", dir: "asc" }]}
                  groupBy={["status", "priority"]}
                  filename="work-orders-export"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Work Order</DialogTitle>
          </DialogHeader>
          <NewWorkOrderDialog 
            sites={sites} 
            onSuccess={handleWorkOrderCreated} 
          />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default WorkOrders;

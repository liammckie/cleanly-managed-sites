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
import { PlusCircle, Search, FilterX, DownloadCloud } from 'lucide-react';
import { useSites } from '@/hooks/useSites';
import { useSubcontractors } from '@/hooks/useSubcontractors';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NewWorkOrderDialog } from '@/components/workorders/NewWorkOrderDialog';
import { ViewToggle } from '@/components/ui/data-table/ViewToggle';
import { TabulatorView } from '@/components/ui/data-table/TabulatorView';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useClients } from '@/hooks/useClients';
import * as XLSX from 'xlsx';
import { DateRange } from 'react-day-picker';

const WorkOrders = () => {
  const { workOrders, isLoadingWorkOrders, workOrdersError, refetchWorkOrders } = useWorkOrders();
  const { data: sites, isLoading: sitesLoading } = useSites();
  const { clients } = useClients();
  const { subcontractors = [] } = useSubcontractors(undefined);
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority | 'all'>('all');
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [subcontractorFilter, setSubcontractorFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [showUnbilledOnly, setShowUnbilledOnly] = useState(false);
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Apply all filters
  const filteredWorkOrders = workOrders.filter(workOrder => {
    // Text search
    const matchesSearch = 
      workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workOrder.site?.name && workOrder.site.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (workOrder.purchase_order_number && workOrder.purchase_order_number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || workOrder.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || workOrder.priority === priorityFilter;
    
    // Site filter
    const matchesSite = siteFilter === 'all' || workOrder.site_id === siteFilter;
    
    // Client filter (via site)
    const matchesClient = clientFilter === 'all' || 
      (workOrder.site?.client_id && workOrder.site.client_id === clientFilter);
    
    // Subcontractor filter
    const matchesSubcontractor = subcontractorFilter === 'all' || 
      workOrder.assigned_to === subcontractorFilter;
    
    // Date range filter
    const matchesDateRange = !dateRange.from || !dateRange.to || 
      (workOrder.due_date && 
        new Date(workOrder.due_date) >= dateRange.from && 
        new Date(workOrder.due_date) <= dateRange.to);
    
    // Completed only filter
    const matchesCompleted = !showCompletedOnly || workOrder.status === 'completed';
    
    // Unbilled only filter (completed but not invoiced)
    const matchesUnbilled = !showUnbilledOnly || 
      (workOrder.status === 'completed' && !workOrder.xero_invoice_id);
    
    // Unpaid only filter (assigned but not paid)
    const matchesUnpaid = !showUnpaidOnly || 
      (workOrder.assigned_to && workOrder.status !== 'paid');
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSite && 
      matchesClient && matchesSubcontractor && matchesDateRange && 
      matchesCompleted && matchesUnbilled && matchesUnpaid;
  });

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
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
    if (!billing || !cost) return "—";
    const margin = ((billing - cost) / billing * 100).toFixed(1);
    return `${margin}%`;
  };

  // Update active filters
  React.useEffect(() => {
    const filters = [];
    
    if (statusFilter !== 'all') filters.push(`Status: ${statusFilter.replace('_', ' ')}`);
    if (priorityFilter !== 'all') filters.push(`Priority: ${priorityFilter}`);
    if (siteFilter !== 'all') {
      const siteName = sites.find(s => s.id === siteFilter)?.name;
      filters.push(`Site: ${siteName || siteFilter}`);
    }
    if (clientFilter !== 'all') {
      const clientName = clients.find(c => c.id === clientFilter)?.name;
      filters.push(`Client: ${clientName || clientFilter}`);
    }
    if (subcontractorFilter !== 'all') {
      const subName = subcontractors.find(s => s.id === subcontractorFilter)?.business_name;
      filters.push(`Contractor: ${subName || subcontractorFilter}`);
    }
    if (dateRange.from && dateRange.to) {
      filters.push(`Date: ${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`);
    }
    if (showCompletedOnly) filters.push('Completed only');
    if (showUnbilledOnly) filters.push('Unbilled only');
    if (showUnpaidOnly) filters.push('Unpaid only');
    
    setActiveFilters(filters);
  }, [statusFilter, priorityFilter, siteFilter, clientFilter, subcontractorFilter, 
      dateRange, showCompletedOnly, showUnbilledOnly, showUnpaidOnly, sites, clients, subcontractors]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSiteFilter('all');
    setClientFilter('all');
    setSubcontractorFilter('all');
    setDateRange({ from: undefined, to: undefined });
    setShowCompletedOnly(false);
    setShowUnbilledOnly(false);
    setShowUnpaidOnly(false);
  };

  // Table columns for tabulator
  const tabulatorColumns = [
    { title: "ID", field: "id", sorter: "string", width: 120 },
    { title: "Title", field: "title", headerFilter: true, sorter: "string", width: 180 },
    { 
      title: "Client", 
      field: "site.client_name", 
      headerFilter: true,
      formatter: (cell: any) => {
        const site = cell.getRow().getData().site;
        return site?.client_name || "—";
      }
    },
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
          
          return `<span class="px-2 py-1 rounded-full text-xs font-medium ${color}">${status?.replace('_', ' ')}</span>`;
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
      title: "Assigned To",
      field: "assigned_to",
      headerFilter: true,
      formatter: (cell: any) => {
        const contractorId = cell.getValue();
        if (!contractorId) return "—";
        const contractor = subcontractors.find(c => c.id === contractorId);
        return contractor ? contractor.business_name : contractorId;
      }
    },
    { 
      title: "Est. Cost", 
      field: "estimated_cost", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      bottomCalc: "sum",
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2, symbol: "$" }
    },
    { 
      title: "Actual Cost", 
      field: "actual_cost", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      bottomCalc: "sum",
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2, symbol: "$" }
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
      title: "Profit Margin",
      field: "profit_margin",
      formatter: (cell: any) => {
        const row = cell.getRow().getData();
        return calculateProfitMargin(row.billing_amount, row.actual_cost || row.estimated_cost);
      }
    },
    {
      title: "PO Number",
      field: "purchase_order_number",
      headerFilter: true,
      formatter: (cell: any) => cell.getValue() || "—"
    },
    {
      title: "Invoiced",
      field: "xero_invoice_id",
      formatter: (cell: any) => cell.getValue() ? "Yes" : "No"
    },
    { 
      title: "Completion Date", 
      field: "completion_date", 
      sorter: "date",
      formatter: (cell: any) => formatDate(cell.getValue())
    },
    { 
      title: "Actions", 
      formatter: "html", 
      width: 120,
      formatterParams: {
        html: (cell: any) => `<a href="/workorders/${cell.getData().id}" class="text-primary hover:underline">View</a>`
      }
    }
  ];

  const handleWorkOrderCreated = () => {
    setCreateDialogOpen(false);
    refetchWorkOrders();
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      // Format data for Excel
      filteredWorkOrders.map(wo => ({
        ID: wo.id,
        Title: wo.title,
        Description: wo.description,
        Status: wo.status?.replace('_', ' '),
        Priority: wo.priority,
        'Due Date': wo.due_date ? formatDate(wo.due_date) : '',
        'Completion Date': wo.completion_date ? formatDate(wo.completion_date) : '',
        Site: wo.site?.name || '',
        Client: wo.site?.client_name || '',
        'Assigned To': subcontractors.find(s => s.id === wo.assigned_to)?.business_name || '',
        'Estimated Cost': wo.estimated_cost || '',
        'Actual Cost': wo.actual_cost || '',
        'Billing Amount': wo.billing_amount || '',
        'PO Number': wo.purchase_order_number || '',
        'Invoiced': wo.xero_invoice_id ? 'Yes' : 'No',
        'Created At': formatDate(wo.created_at)
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Work Orders');
    XLSX.writeFile(workbook, 'work-orders-export.xlsx');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <div className="max-w-full mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Work Orders</h1>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportToExcel}>
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Work Order
                  </Button>
                </div>
              </div>
              
              <Card className="mb-6 p-4">
                <div className="flex flex-col space-y-4">
                  {/* Quick search and view toggle */}
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
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            More Filters
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-4 space-y-4">
                          <h4 className="font-medium text-sm">Additional Filters</h4>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Site</label>
                            <Select 
                              value={siteFilter} 
                              onValueChange={(value) => setSiteFilter(value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="All Sites" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Sites</SelectItem>
                                {sites.map(site => (
                                  <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Client</label>
                            <Select 
                              value={clientFilter} 
                              onValueChange={(value) => setClientFilter(value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="All Clients" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Clients</SelectItem>
                                {clients.map(client => (
                                  <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Contractor</label>
                            <Select 
                              value={subcontractorFilter} 
                              onValueChange={(value) => setSubcontractorFilter(value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="All Contractors" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Contractors</SelectItem>
                                {subcontractors.map(sub => (
                                  <SelectItem key={sub.id} value={sub.id}>{sub.business_name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Date Range</label>
                            <DateRangePicker 
                              value={dateRange}
                              onChange={setDateRange}
                            />
                          </div>
                          
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="completed" 
                                checked={showCompletedOnly}
                                onCheckedChange={(checked) => setShowCompletedOnly(checked as boolean)}
                              />
                              <label htmlFor="completed" className="text-sm">
                                Show completed only
                              </label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="unbilled" 
                                checked={showUnbilledOnly}
                                onCheckedChange={(checked) => setShowUnbilledOnly(checked as boolean)}
                              />
                              <label htmlFor="unbilled" className="text-sm">
                                Show unbilled only
                              </label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="unpaid" 
                                checked={showUnpaidOnly}
                                onCheckedChange={(checked) => setShowUnpaidOnly(checked as boolean)}
                              />
                              <label htmlFor="unpaid" className="text-sm">
                                Show unpaid only
                              </label>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      {activeFilters.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1">
                          <FilterX className="h-4 w-4" />
                          Reset filters
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Active filters display */}
                  {activeFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2">
                      {activeFilters.map((filter, index) => (
                        <Badge key={index} variant="secondary" className="px-2 py-1">
                          {filter}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
              
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

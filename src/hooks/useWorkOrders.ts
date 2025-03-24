
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getWorkOrders, 
  getWorkOrder, 
  createWorkOrder, 
  updateWorkOrder, 
  deleteWorkOrder, 
  updateWorkOrderStatus, 
  assignWorkOrder,
  getSiteWorkOrders,
  addWorkOrderAttachment,
  removeWorkOrderAttachment,
  completeWorkOrder
} from '@/lib/api/workorders/workOrdersApi';
import { WorkOrderStatus, CreateWorkOrderData, UpdateWorkOrderData } from '@/lib/api/workorders/types';
import { WorkOrderAttachment } from '@/hooks/useGoogleDriveFiles';

export const useWorkOrders = () => {
  const queryClient = useQueryClient();
  
  // Get all work orders with full details
  const { 
    data: workOrders = [], 
    isLoading: isLoadingWorkOrders,
    error: workOrdersError,
    refetch: refetchWorkOrders
  } = useQuery({
    queryKey: ['workOrders'],
    queryFn: getWorkOrders
  });
  
  // Get a specific work order
  const useWorkOrder = (id: string) => useQuery({
    queryKey: ['workOrder', id],
    queryFn: () => getWorkOrder(id),
    enabled: !!id
  });
  
  // Get work orders for a specific site
  const useSiteWorkOrders = (siteId: string) => useQuery({
    queryKey: ['siteWorkOrders', siteId],
    queryFn: () => getSiteWorkOrders(siteId),
    enabled: !!siteId
  });
  
  // Create a new work order
  const createWorkOrderMutation = useMutation({
    mutationFn: (data: CreateWorkOrderData) => createWorkOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      toast.success('Work order created successfully');
    },
    onError: (error) => {
      console.error('Error creating work order:', error);
      toast.error('Failed to create work order');
    }
  });
  
  // Create and mark complete in one step
  const createAndCompleteWorkOrderMutation = useMutation({
    mutationFn: async (data: CreateWorkOrderData) => {
      // First create the work order with status completed
      const workOrderData = {
        ...data,
        status: 'completed' as WorkOrderStatus
      };
      return createWorkOrder(workOrderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      toast.success('Work order created and marked as completed');
    },
    onError: (error) => {
      console.error('Error creating and completing work order:', error);
      toast.error('Failed to create and complete work order');
    }
  });
  
  // Update an existing work order
  const updateWorkOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkOrderData }) => 
      updateWorkOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['workOrder', id] });
      toast.success('Work order updated successfully');
    },
    onError: (error) => {
      console.error('Error updating work order:', error);
      toast.error('Failed to update work order');
    }
  });
  
  // Delete a work order
  const deleteWorkOrderMutation = useMutation({
    mutationFn: (id: string) => deleteWorkOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      toast.success('Work order deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting work order:', error);
      toast.error('Failed to delete work order');
    }
  });
  
  // Update a work order status
  const updateWorkOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: WorkOrderStatus }) => 
      updateWorkOrderStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['workOrder', id] });
      toast.success('Work order status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating work order status:', error);
      toast.error('Failed to update work order status');
    }
  });
  
  // Assign a work order to a subcontractor
  const assignWorkOrderMutation = useMutation({
    mutationFn: ({ id, subcontractorId }: { id: string; subcontractorId: string }) => 
      assignWorkOrder(id, subcontractorId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['workOrder', id] });
      toast.success('Work order assigned successfully');
    },
    onError: (error) => {
      console.error('Error assigning work order:', error);
      toast.error('Failed to assign work order');
    }
  });
  
  // Mark a work order as completed
  const completeWorkOrderMutation = useMutation({
    mutationFn: ({ id, completionDate }: { id: string; completionDate?: string }) => 
      completeWorkOrder(id, completionDate),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['workOrder', id] });
      toast.success('Work order marked as completed');
    },
    onError: (error) => {
      console.error('Error completing work order:', error);
      toast.error('Failed to mark work order as completed');
    }
  });
  
  // Add attachment to a work order
  const addAttachmentMutation = useMutation({
    mutationFn: ({ id, attachment }: { id: string; attachment: WorkOrderAttachment }) => 
      addWorkOrderAttachment(id, attachment),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['workOrder', id] });
      toast.success('Attachment added successfully');
    },
    onError: (error) => {
      console.error('Error adding attachment:', error);
      toast.error('Failed to add attachment');
    }
  });
  
  // Remove attachment from a work order
  const removeAttachmentMutation = useMutation({
    mutationFn: ({ id, attachmentId }: { id: string; attachmentId: string }) => 
      removeWorkOrderAttachment(id, attachmentId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['workOrder', id] });
      toast.success('Attachment removed successfully');
    },
    onError: (error) => {
      console.error('Error removing attachment:', error);
      toast.error('Failed to remove attachment');
    }
  });
  
  return {
    // Queries
    workOrders,
    isLoadingWorkOrders,
    workOrdersError,
    refetchWorkOrders,
    useWorkOrder,
    useSiteWorkOrders,
    
    // Mutations
    createWorkOrderMutation,
    createAndCompleteWorkOrderMutation,
    updateWorkOrderMutation,
    deleteWorkOrderMutation,
    updateWorkOrderStatusMutation,
    assignWorkOrderMutation,
    completeWorkOrderMutation,
    addAttachmentMutation,
    removeAttachmentMutation
  };
};

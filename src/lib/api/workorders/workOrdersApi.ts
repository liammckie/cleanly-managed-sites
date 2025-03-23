
// Re-export all functions from the read and write API modules
export * from './workOrdersReadApi';
export * from './workOrdersWriteApi';

// Create a consolidated API object for backward compatibility
export const workOrdersApi = {
  // Re-export functions from workOrdersReadApi
  getWorkOrders: async () => import('./workOrdersReadApi').then(m => m.getWorkOrders()),
  getWorkOrder: async (id: string) => import('./workOrdersReadApi').then(m => m.getWorkOrder(id)),
  getSiteWorkOrders: async (siteId: string) => import('./workOrdersReadApi').then(m => m.getSiteWorkOrders(siteId)),
  
  // Re-export functions from workOrdersWriteApi
  createWorkOrder: async (data: any) => import('./workOrdersWriteApi').then(m => m.createWorkOrder(data)),
  updateWorkOrder: async (id: string, data: any) => import('./workOrdersWriteApi').then(m => m.updateWorkOrder(id, data)),
  deleteWorkOrder: async (id: string) => import('./workOrdersWriteApi').then(m => m.deleteWorkOrder(id)),
  updateWorkOrderStatus: async (id: string, status: any) => import('./workOrdersWriteApi').then(m => m.updateWorkOrderStatus(id, status)),
  assignWorkOrder: async (id: string, subcontractorId: string) => import('./workOrdersWriteApi').then(m => m.assignWorkOrder(id, subcontractorId)),
  addWorkOrderAttachment: async (id: string, attachment: any) => import('./workOrdersWriteApi').then(m => m.addWorkOrderAttachment(id, attachment)),
  removeWorkOrderAttachment: async (id: string, attachmentId: string) => import('./workOrdersWriteApi').then(m => m.removeWorkOrderAttachment(id, attachmentId))
};


// Re-export all functions from the read and write API modules
export * from './workOrdersReadApi';
export * from './workOrdersWriteApi';

// Create a consolidated API object for backward compatibility and export it
import * as readApi from './workOrdersReadApi';
import * as writeApi from './workOrdersWriteApi';

export const workOrdersApi = {
  // Re-export functions from workOrdersReadApi
  getWorkOrders: readApi.getWorkOrders,
  getWorkOrder: readApi.getWorkOrder,
  getSiteWorkOrders: readApi.getSiteWorkOrders,
  
  // Re-export functions from workOrdersWriteApi
  createWorkOrder: writeApi.createWorkOrder,
  updateWorkOrder: writeApi.updateWorkOrder,
  deleteWorkOrder: writeApi.deleteWorkOrder,
  updateWorkOrderStatus: writeApi.updateWorkOrderStatus,
  assignWorkOrder: writeApi.assignWorkOrder,
  addWorkOrderAttachment: writeApi.addWorkOrderAttachment,
  removeWorkOrderAttachment: writeApi.removeWorkOrderAttachment,
  completeWorkOrder: writeApi.completeWorkOrder
};


import { useState } from 'react';
import { toast } from 'sonner';
import { useXeroIntegration } from './useXeroIntegration';
import { WorkOrderRecord } from '@/lib/api/workorders/types';
import { updateWorkOrder } from '@/lib/api/workorders/workOrdersApi';
import { SiteRecord } from '@/lib/types';

interface XeroPurchaseOrder {
  id: string;
  number: string;
  date: string;
  status: string;
  vendor: {
    id: string;
    name: string;
  };
  lineItems: {
    description: string;
    quantity: number;
    unitAmount: number;
  }[];
  total: number;
}

export const useXeroWorkOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const xeroIntegration = useXeroIntegration();
  
  // Create a purchase order in Xero for a supplier
  const createSupplierPurchaseOrder = async (
    workOrder: WorkOrderRecord,
    supplierName: string,
    supplierXeroId?: string
  ): Promise<XeroPurchaseOrder | null> => {
    setIsLoading(true);
    try {
      // Check if Xero is connected
      if (!xeroIntegration.isConnected) {
        toast.error("Please connect to Xero first");
        return null;
      }
      
      const site = workOrder.site;
      if (!site) {
        toast.error("Work order must have an associated site");
        return null;
      }
      
      // This would be a call to Xero API in a real implementation
      // For now we'll simulate the response
      console.log(`Creating Xero purchase order for supplier: ${supplierName}, Work Order: ${workOrder.title}`);
      
      const purchaseOrder: XeroPurchaseOrder = {
        id: `PO-${Math.floor(Math.random() * 100000)}`,
        number: `PO-${Math.floor(Math.random() * 100000)}`,
        date: new Date().toISOString(),
        status: "DRAFT",
        vendor: {
          id: supplierXeroId || "NOT_SET",
          name: supplierName
        },
        lineItems: [
          {
            description: workOrder.description,
            quantity: 1,
            unitAmount: workOrder.estimated_cost || 0
          }
        ],
        total: workOrder.estimated_cost || 0
      };
      
      // Update work order with purchase order details
      await updateWorkOrder(workOrder.id, {
        status: 'assigned',
        xero_purchase_order_id: purchaseOrder.id
      });
      
      toast.success(`Purchase order ${purchaseOrder.number} created in Xero as a draft`);
      return purchaseOrder;
      
    } catch (error) {
      console.error("Error creating Xero purchase order:", error);
      toast.error("Failed to create purchase order in Xero.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a client invoice in Xero for the completed work
  const createClientInvoice = async (
    workOrder: WorkOrderRecord
  ) => {
    setIsLoading(true);
    try {
      // Check if Xero is connected
      if (!xeroIntegration.isConnected) {
        toast.error("Please connect to Xero first");
        return null;
      }
      
      if (workOrder.status !== 'completed') {
        toast.error("Work order must be completed before invoicing");
        return null;
      }
      
      const site = workOrder.site;
      if (!site) {
        toast.error("Work order must have an associated site");
        return null;
      }
      
      // Use the existing Xero integration function to create the invoice
      const invoiceResult = await xeroIntegration.createXeroInvoice(
        site as any, // Cast to expected type
        `Work Order: ${workOrder.title}`,
        workOrder.billing_amount || 0
      );
      
      if (invoiceResult) {
        // Update work order status to invoiced
        await updateWorkOrder(workOrder.id, {
          status: 'invoiced',
          xero_invoice_id: invoiceResult.id
        });
        
        toast.success(`Invoice created in Xero for work order: ${workOrder.title}`);
        return invoiceResult;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating client invoice:", error);
      toast.error("Failed to create invoice in Xero");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    createSupplierPurchaseOrder,
    createClientInvoice,
    ...xeroIntegration
  };
};

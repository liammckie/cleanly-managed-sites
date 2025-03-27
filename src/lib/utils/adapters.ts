
import { Json } from '@/lib/types';

/**
 * Type for quote records from the database
 */
export interface QuoteRecord {
  id: string;
  name: string;
  title?: string;
  client_name: string;
  site_name?: string;
  description?: string;
  status: string;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

/**
 * Converts a database record to a quote entity for the frontend
 */
export function adaptQuoteData(data: QuoteRecord) {
  return {
    id: data.id,
    name: data.name,
    title: data.title,
    clientName: data.client_name,
    siteName: data.site_name,
    description: data.description,
    status: data.status,
    overheadPercentage: data.overhead_percentage,
    marginPercentage: data.margin_percentage,
    totalPrice: data.total_price,
    laborCost: data.labor_cost,
    suppliesCost: data.supplies_cost,
    equipmentCost: data.equipment_cost,
    subcontractorCost: data.subcontractor_cost,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    clientId: data.client_id,
    siteId: data.site_id,
    // Additional fields can be added as needed
  };
}

/**
 * Prepares a quote entity for API submission
 */
export function prepareQuoteForApi(data: any) {
  return {
    id: data.id,
    name: data.name,
    title: data.title,
    client_name: data.clientName || data.client_name,
    site_name: data.siteName || data.site_name,
    client_id: data.clientId || data.client_id,
    site_id: data.siteId || data.site_id,
    description: data.description,
    status: data.status,
    overhead_percentage: data.overheadPercentage || data.overhead_percentage,
    margin_percentage: data.marginPercentage || data.margin_percentage,
    total_price: data.totalPrice || data.total_price,
    labor_cost: data.laborCost || data.labor_cost,
    supplies_cost: data.suppliesCost || data.supplies_cost,
    equipment_cost: data.equipmentCost || data.equipment_cost,
    subcontractor_cost: data.subcontractorCost || data.subcontractor_cost,
    // Additional fields can be added as needed
  };
}

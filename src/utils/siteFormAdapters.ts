
import { SiteFormData as UISiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteFormData as ModelSiteFormData } from '@/types/models';
import { BillingLine as UIBillingLine } from '@/components/sites/forms/types/billingTypes';
import { BillingLine as ModelBillingLine } from '@/types/models';

/**
 * Converts a BillingLine from model format to UI format
 */
export function adaptBillingLine(modelLine: ModelBillingLine): UIBillingLine {
  // Ensure modelLine has the required properties or set defaults
  const formattedLine: UIBillingLine = {
    id: modelLine.id,
    description: modelLine.description,
    amount: modelLine.amount,
    frequency: modelLine.frequency || 'monthly',
    isRecurring: modelLine.isRecurring !== undefined ? modelLine.isRecurring : true,
    onHold: modelLine.onHold !== undefined ? modelLine.onHold : false,
    // Add any other properties needed for UIBillingLine
    weeklyAmount: modelLine.weeklyAmount,
    monthlyAmount: modelLine.monthlyAmount,
    annualAmount: modelLine.annualAmount
  };
  
  return formattedLine;
}

/**
 * Converts a SiteFormData from model format to UI format
 */
export function adaptSiteFormData(modelData: ModelSiteFormData): UISiteFormData {
  return {
    ...modelData,
    postalCode: modelData.postal_code || '',
    contacts: modelData.contacts || [],
    billingDetails: modelData.billingDetails ? {
      ...modelData.billingDetails,
      billingLines: modelData.billingDetails.billingLines?.map(adaptBillingLine) || []
    } : undefined
  };
}

/**
 * Converts a SiteFormData from UI format to model format
 */
export function convertToModelSiteFormData(uiData: UISiteFormData): ModelSiteFormData {
  const modelData: Partial<ModelSiteFormData> = {
    ...uiData,
    postal_code: uiData.postalCode,
    // Copy additional properties that need conversion
    contract_details: uiData.contractDetails || uiData.contract_details,
    // Ensure billingDetails is properly formatted if it exists
    billingDetails: uiData.billingDetails ? {
      ...uiData.billingDetails,
      // Add any conversion specific to billingDetails if needed
    } : undefined
  };
  
  // If there are more conversions needed, add them here
  return modelData as ModelSiteFormData;
}

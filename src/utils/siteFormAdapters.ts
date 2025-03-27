
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
    id: modelLine.id || crypto.randomUUID(),
    description: modelLine.description,
    amount: modelLine.amount,
    frequency: modelLine.frequency === 'weekly' || modelLine.frequency === 'monthly' || 
               modelLine.frequency === 'quarterly' || modelLine.frequency === 'annually' ? 
               modelLine.frequency : 'monthly',
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
    } : {
      billingLines: [],
      useClientInfo: false,
      billingMethod: '',
      paymentTerms: '',
      billingEmail: '',
      contacts: []
    }
  };
}

/**
 * Converts a SiteFormData from UI format to model format
 */
export function convertToModelSiteFormData(uiData: UISiteFormData): ModelSiteFormData {
  const modelData: any = {
    ...uiData,
    postal_code: uiData.postalCode,
    // Copy additional properties that need conversion
    contract_details: uiData.contractDetails || uiData.contract_details,
  };
  
  // Remove UI-specific fields not needed in the model
  delete modelData.postalCode;
  delete modelData.contractDetails;
  
  // Ensure billingDetails is properly formatted if it exists
  if (uiData.billingDetails) {
    modelData.billingDetails = {
      ...uiData.billingDetails,
      // Add any conversion specific to billingDetails if needed
      serviceDeliveryType: uiData.billingDetails.serviceDeliveryType === 'direct' || 
                           uiData.billingDetails.serviceDeliveryType === 'contractor' ?
                           uiData.billingDetails.serviceDeliveryType : 'direct'
    };
    
    // Convert billingAddress if it exists
    if (uiData.billingDetails.billingAddress) {
      modelData.billingDetails.billingAddress = {
        ...uiData.billingDetails.billingAddress,
        postal_code: uiData.billingDetails.billingAddress.postcode
      };
      delete modelData.billingDetails.billingAddress.postcode;
    }
  }
  
  return modelData as ModelSiteFormData;
}

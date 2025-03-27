
import { SiteFormData as UISiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteFormData as ModelSiteFormData } from '@/types/models';
import { BillingLine as UIBillingLine } from '@/components/sites/forms/types/billingTypes';
import { BillingLine as ModelBillingLine } from '@/types/models';

/**
 * Converts a BillingLine from model format to UI format
 */
export function adaptBillingLine(modelLine: ModelBillingLine): UIBillingLine {
  return {
    ...modelLine,
    isRecurring: modelLine.isRecurring ?? true,
    onHold: modelLine.onHold ?? false
  };
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
  return {
    ...uiData,
    postal_code: uiData.postalCode,
    // If there are more conversions needed, add them here
  } as unknown as ModelSiteFormData;
}


import { useEffect } from 'react';
import { SiteFormData } from '../types/siteFormData';
import { SiteRecord } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { BillingLine } from '../types/billingTypes';
import { asJsonObject } from '@/lib/utils/json';

export function useSiteFormData(
  site: SiteRecord, 
  formData: SiteFormData, 
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>,
  form: any
) {
  // Prepare data for form when site data is loaded
  useEffect(() => {
    if (site) {
      // Create a new form data object using the site data
      const updatedFormData: SiteFormData = {
        ...formData,
        name: site.name || '',
        client_id: site.client_id || '',
        address: site.address || '',
        city: site.city || '',
        state: site.state || '',
        postalCode: site.postcode || '', // Map postcode to postalCode
        status: site.status || 'active',
        // Set contract details if available
        contract_details: {
          ...formData.contract_details,
          contractType: site.contract_details && typeof site.contract_details === 'object' 
            ? (site.contract_details as any).contractType || 'cleaning'
            : 'cleaning'
        }
      };
      
      // Add billing lines with unique IDs if available
      if (site.billingLines && site.billingLines.length > 0) {
        const formattedBillingLines: BillingLine[] = site.billingLines.map((line: any) => ({
          id: uuidv4(), // Generate unique ID for each line
          description: line.description || '',
          amount: line.amount || 0,
          frequency: line.frequency || 'monthly',
          isRecurring: line.is_recurring !== undefined ? line.is_recurring : true,
          onHold: line.on_hold || false,
          weeklyAmount: line.weekly_amount,
          monthlyAmount: line.monthly_amount,
          annualAmount: line.annual_amount,
          holdStartDate: line.hold_start_date,
          holdEndDate: line.hold_end_date,
          creditAmount: line.credit_amount,
          creditDate: line.credit_date,
          creditReason: line.credit_reason
        }));
        
        updatedFormData.billingDetails = {
          ...updatedFormData.billingDetails,
          billingLines: formattedBillingLines,
          totalWeeklyAmount: site.weekly_revenue || 0,
          totalAnnualAmount: site.annual_revenue || 0,
          totalMonthlyAmount: (site.weekly_revenue || 0) * 4.33, // Approximate monthly from weekly
        };
      }
      
      // Add additional contracts if available
      if (site.additional_contracts && site.additional_contracts.length > 0) {
        updatedFormData.additionalContracts = site.additional_contracts;
      }
      
      // Update the form data
      setFormData(updatedFormData);
      
      // Update the form in react-hook-form
      Object.entries(updatedFormData).forEach(([key, value]) => {
        if (typeof value !== 'object' || value === null) {
          form.setValue(key as any, value);
        }
      });
    }
  }, [site]);

  return { formData };
}

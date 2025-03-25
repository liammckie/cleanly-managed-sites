
import { SiteFormData } from '../../types';

export interface ServiceDeliveryMethodProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  annualDirectCost: number;
  annualContractorCost: number;
  profitMargin: number;
  annualValue: number;
}


import { SiteFormData } from '../../types';

export interface PrimaryContractInformationProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  annualValue: number;
}

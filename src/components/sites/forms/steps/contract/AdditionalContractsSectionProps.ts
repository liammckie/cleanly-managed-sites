
import { SiteFormData } from '../../types';
import { Dispatch, SetStateAction } from 'react';

export interface AdditionalContractsSectionProps {
  formData: SiteFormData;
  setFormData: Dispatch<SetStateAction<SiteFormData>>;
}

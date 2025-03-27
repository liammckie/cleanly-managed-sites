
import { SiteFormData } from '../types/siteFormData';

export interface EditSiteFormProps {
  site?: SiteFormData | any;
  initialData?: Partial<SiteFormData>;
  siteId?: string;
  onSubmit?: (data: SiteFormData) => void;
  isLoading?: boolean;
}

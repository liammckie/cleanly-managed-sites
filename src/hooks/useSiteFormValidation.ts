
import { useFormValidation } from './useFormValidation';
import { siteFormSchema } from '@/lib/validation/schemas/siteSchema';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

export function useSiteFormValidation() {
  // Use our generic form validation hook with the site schema
  return useFormValidation<SiteFormData>(siteFormSchema);
}

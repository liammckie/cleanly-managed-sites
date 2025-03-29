
import { useFormValidation } from './useFormValidation';
import { siteFormSchema } from '@/lib/validation/schemas';
import { SiteFormData } from '@/lib/types';

/**
 * Custom hook for site form validation using the centralized schema
 */
export function useSiteFormValidation() {
  // Use our generic form validation hook with the site schema
  return useFormValidation<SiteFormData>(siteFormSchema);
}

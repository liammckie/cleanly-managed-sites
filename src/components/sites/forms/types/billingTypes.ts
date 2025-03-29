
import { BillingLine, BillingContact, BillingAddress } from '@/types/models';

// Re-export the interfaces from models
export { BillingLine, BillingContact, BillingAddress };

// Add any component-specific extensions here if needed
export interface BillingLineProps {
  line: BillingLine;
  onChange: (updated: BillingLine) => void;
  onRemove: (id: string) => void;
}

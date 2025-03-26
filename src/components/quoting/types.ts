
import { Quote, QuoteShift, QuoteSubcontractor } from "@/types/models";
import { ChangeEvent } from "react";

export interface QuoteDetailsFormProps {
  quote: Quote;
  onUpdate: (field: string, value: any) => void;
}

export interface QuoteDetailsProps {
  quote: Quote;
  onQuoteSelect?: (quoteId: string) => void;
}

export interface QuoteFormDetailsProps {
  formData: any;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onOverheadProfileSelect: (profileId: string) => void;
  overheadProfiles: { value: string; label: string; laborPercentage: number }[];
  isLoadingProfiles: boolean;
}

export interface ShiftPlannerProps {
  shifts: QuoteShift[];
  onAddShift?: (shiftData: Partial<QuoteShift>) => void;
  onRemoveShift?: (shiftId: string) => void;
  onShiftsChange?: (newShifts: QuoteShift[]) => void;
  quoteId?: string | null;
}

export interface SubcontractorSectionProps {
  subcontractors: QuoteSubcontractor[];
  onAddSubcontractor?: (subcontractor: Partial<QuoteSubcontractor>) => void;
  onRemoveSubcontractor?: (subcontractorId: string) => void;
  onSubcontractorsChange?: (newSubcontractors: QuoteSubcontractor[]) => void;
}

export interface DeleteUserModalProps {
  isOpen: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
}

export interface ContractTerm {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
}

export interface ContractSummary {
  id?: string;
  totalValue: number;
  expiringWithin30Days: number;
  renewalRate: number;
}

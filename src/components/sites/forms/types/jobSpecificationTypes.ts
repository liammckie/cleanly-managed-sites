
export type JobSpecifications = {
  daysPerWeek: number;
  hoursPerDay: number;
  directEmployees: boolean;
  notes: string;
  requiresSpecialEquipment?: boolean;
  equipmentDetails?: string;
  cleaningInstructions?: string;
  areas?: string[];
  workingDays?: Record<string, boolean>;
  serviceDeliveryType?: 'direct' | 'contractor';
  annualContractorCost?: number;
  contractorInvoiceFrequency?: 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';
}

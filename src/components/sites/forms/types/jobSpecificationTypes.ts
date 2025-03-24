
export interface WorkingDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface AreaSpecification {
  name: string;
  details: string;
}

export interface JobSpecifications {
  daysPerWeek: number;
  hoursPerDay: number;
  directEmployees: boolean;
  notes: string;
  requiresSpecialEquipment?: boolean;
  equipmentDetails?: string;
  cleaningInstructions?: string;
  areas?: AreaSpecification[];
  workingDays?: WorkingDays;
  serviceDeliveryType?: 'direct' | 'contractor'; // Added property
  annualContractorCost?: number; // Added property
  
  // Add missing properties from error messages
  cleaningFrequency?: string;
  customFrequency?: string;
  serviceDays?: string;
  serviceTime?: string;
  estimatedHours?: string | number;
  equipmentRequired?: string;
  scopeNotes?: string;
}


export type JobSpecifications = {
  daysPerWeek: number;
  hoursPerDay: number;
  directEmployees: boolean;
  notes: string;
  workingDays?: {
    [key: string]: boolean;
  };
  
  // Add legacy properties for compatibility
  requiresSpecialEquipment?: boolean;
  equipmentDetails?: string;
  cleaningInstructions?: string;
  areas?: any[];
}

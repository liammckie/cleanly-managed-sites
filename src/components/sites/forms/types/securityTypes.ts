
export interface SecurityDetails {
  alarmCode?: string;
  hasSecuritySystem?: boolean;
  securityCompany?: string;
  securityContact?: string;
  keyLocation?: string;
  accessInstructions?: string;
  notes?: string;
  
  // Additional potential fields
  keypadLocation?: string;
  securityCameras?: boolean;
  restrictedAreas?: string[];
  emergencyContact?: string;
  emergencyPhone?: string;
  specialInstructions?: string;
}

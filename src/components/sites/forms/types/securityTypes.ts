
export interface SecurityDetails {
  alarmCode?: string;
  keyLocation?: string;
  securityNotes?: string;
  alarmInstructions?: string;
  contactOnSite?: string;
  contactPhone?: string;
  hasCameras?: boolean;
  needsSecurityCheck?: boolean;
  accessType?: 'key' | 'card' | 'code' | 'other';
}

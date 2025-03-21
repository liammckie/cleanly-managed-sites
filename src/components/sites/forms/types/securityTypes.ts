
export type SecurityDetails = {
  accessCode: string;
  alarmCode: string;
  keyLocation: string;
  outOfHoursAccess: boolean;
  
  // Add legacy properties for compatibility
  needsAlarmCode?: boolean;
  needsKey?: boolean;
  hasSecurity?: boolean;
  securityNotes?: string;
  hasCamera?: boolean;
  cameraDetails?: string;
}

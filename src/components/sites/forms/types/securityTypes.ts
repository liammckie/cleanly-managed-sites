
export interface SecurityDetails {
  accessCode: string;
  alarmCode: string;
  keyLocation: string;
  outOfHoursAccess: boolean;
  needsAlarmCode?: boolean;
  needsKey?: boolean;
  hasSecurity?: boolean;
  securityNotes?: string;
  hasCamera?: boolean;
  cameraDetails?: string;
}

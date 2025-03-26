
export interface SecurityDetails {
  hasAlarm?: boolean;
  alarmCode?: string;
  keyRequired?: boolean;
  keyLocation?: string;
  swipeCard?: boolean;
  parkingDetails?: string;
  accessNotes?: string;
  // Additional fields needed by components
  accessCode?: string;
  outOfHoursAccess?: boolean;
}

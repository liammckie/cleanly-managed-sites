
import { QuoteStatus, Frequency, Day, EmployeeLevel, EmploymentType } from '@/types/common';

// Function to safely cast string to QuoteStatus
export function toQuoteStatus(status: string): QuoteStatus {
  // Define valid statuses
  const validStatuses: QuoteStatus[] = [
    'draft', 'sent', 'approved', 'rejected', 'expired', 'pending', 'accepted'
  ];
  
  return validStatuses.includes(status as QuoteStatus) 
    ? (status as QuoteStatus) 
    : 'draft'; // Default to draft if invalid
}

// Function to safely cast string to Day
export function toDay(day: string): Day {
  const validDays: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return validDays.includes(day.toLowerCase() as Day) 
    ? (day.toLowerCase() as Day) 
    : 'monday'; // Default to Monday if invalid
}

// Function to safely cast string to Frequency
export function toFrequency(frequency: string): Frequency {
  const validFrequencies: Frequency[] = [
    'daily', 'weekly', 'fortnightly', 'monthly', 'quarterly', 'yearly', 'once'
  ];
  
  return validFrequencies.includes(frequency as Frequency) 
    ? (frequency as Frequency) 
    : 'monthly'; // Default to monthly if invalid
}

// Function to safely cast string to EmploymentType
export function toEmploymentType(type: string): EmploymentType {
  const validTypes: EmploymentType[] = ['casual', 'part_time', 'full_time'];
  
  // Handle legacy values
  if (type === 'partTime') return 'part_time';
  if (type === 'fullTime') return 'full_time';
  
  return validTypes.includes(type as EmploymentType) 
    ? (type as EmploymentType) 
    : 'casual'; // Default to casual if invalid
}

// Function to safely cast number to EmployeeLevel
export function toEmployeeLevel(level: number): EmployeeLevel {
  const validLevels: EmployeeLevel[] = [1, 2, 3, 4, 5, 6, 7, 8];
  
  return validLevels.includes(level as EmployeeLevel) 
    ? (level as EmployeeLevel) 
    : 1; // Default to level 1 if invalid
}

// Function to safely cast string to contract length unit
export function toContractLengthUnit(unit: string): "months" | "weeks" | "days" | "years" {
  const validUnits = ["months", "weeks", "days", "years"];
  
  return validUnits.includes(unit as any) 
    ? (unit as "months" | "weeks" | "days" | "years") 
    : "months"; // Default to months if invalid
}

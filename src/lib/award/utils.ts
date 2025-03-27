import { QuoteShift } from '@/lib/types/quotes';
import { cleaningServicesAward } from './awardData';

// Helper function to calculate hour difference between two times
export function calculateHourDifference(
  startTime: string,
  endTime: string,
  breakDuration = 0
): number {
  // Format: "HH:MM"
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  // Convert to minutes
  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;
  
  // Subtract break duration and convert back to hours
  return (endInMinutes - startInMinutes - breakDuration) / 60;
}

// Calculate total labor cost for a collection of shifts
export function calculateTotalLaborCost(shifts: QuoteShift[]): number {
  return shifts.reduce((sum, shift) => sum + (shift.estimated_cost || 0) * (shift.number_of_cleaners || 1), 0);
}

// Helper function to format time
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Helper function to generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Helper function to calculate the total cost of allowances
export function calculateTotalAllowances(shift: QuoteShift): number {
  let totalAllowances = 0;
  if (shift.allowances && shift.allowances.length > 0) {
    shift.allowances.forEach(allowance => {
      const allowanceAmount = cleaningServicesAward.defaultSettings.allowances[allowance] || 0;
      totalAllowances += allowanceAmount;
    });
  }
  return totalAllowances;
}

// Helper function to generate a mock shift
export function generateMockShift(overrides: Partial<QuoteShift> = {}): QuoteShift {
  return {
    id: Math.random().toString(36).substring(2, 9),
    quote_id: overrides.quote_id || '',
    day: overrides.day || 'monday',
    start_time: overrides.start_time || '09:00',
    end_time: overrides.end_time || '17:00',
    break_duration: overrides.break_duration || 30,
    number_of_cleaners: overrides.number_of_cleaners || 1,
    employment_type: overrides.employment_type || 'casual',
    level: overrides.level || 1,
    allowances: overrides.allowances || [],
    estimated_cost: overrides.estimated_cost || 250,
    location: overrides.location || 'Main Building',
    notes: overrides.notes || ''
  };
}

// Helper function to generate a mock quote
export function generateMockQuote(overrides: Partial<QuoteShift> = {}): QuoteShift {
  return {
    id: Math.random().toString(36).substring(2, 9),
    quote_id: overrides.quote_id || '',
    day: overrides.day || 'monday',
    start_time: overrides.start_time || '09:00',
    end_time: overrides.end_time || '17:00',
    break_duration: overrides.break_duration || 30,
    number_of_cleaners: overrides.number_of_cleaners || 1,
    employment_type: overrides.employment_type || 'casual',
    level: overrides.level || 1,
    allowances: overrides.allowances || [],
    estimated_cost: overrides.estimated_cost || 250,
    location: overrides.location || 'Main Building',
    notes: overrides.notes || ''
  };
}

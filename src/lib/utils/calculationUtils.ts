
import { Shift, Scenario } from '@/lib/types/quoteTypes';

/**
 * Calculate the cost of a shift
 */
export const calculateShiftCost = (shift: Shift, options: any = {}): number => {
  if (!shift.startTime || !shift.endTime) return 0;
  
  // Parse times
  const [startHour, startMin] = shift.startTime.split(':').map(Number);
  const [endHour, endMin] = shift.endTime.split(':').map(Number);
  
  // Calculate shift length in hours
  let hours = endHour - startHour + (endMin - startMin) / 60;
  if (hours < 0) hours += 24; // Handle overnight shifts
  
  // Subtract break time
  const breakHours = (shift.breakDuration || 0) / 60;
  const workHours = Math.max(0, hours - breakHours);
  
  // Base hourly rates by level
  const rates: Record<number, number> = {
    1: 25,
    2: 28,
    3: 32,
    4: 36,
    5: 40
  };
  
  // Employment type multipliers
  const typeMultipliers: Record<string, number> = {
    casual: 1.25,
    part_time: 1,
    full_time: 1
  };
  
  // Day of week multipliers
  const dayMultipliers: Record<string, number> = {
    monday: 1,
    tuesday: 1,
    wednesday: 1,
    thursday: 1,
    friday: 1,
    saturday: 1.5,
    sunday: 2
  };
  
  // Get base rate
  const baseRate = rates[shift.level || 1] || rates[1];
  
  // Apply multipliers
  const employmentType = shift.employmentType || 'casual';
  const day = shift.day || 'monday';
  
  const adjustedRate = baseRate * 
    (typeMultipliers[employmentType] || 1) * 
    (dayMultipliers[day] || 1);
  
  // Calculate total cost
  const numberOfCleaners = shift.numberOfCleaners || 1;
  const cost = workHours * adjustedRate * numberOfCleaners;
  
  return Math.round(cost * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate various metrics for a scenario
 */
export const calculateScenario = (scenario: Scenario, options: any = {}): {
  totalHours: number;
  laborCost: number;
  totalCost: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  profitMargin: number;
} => {
  // Default values
  return {
    totalHours: 0,
    laborCost: 0,
    totalCost: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    profitMargin: 0
  };
};

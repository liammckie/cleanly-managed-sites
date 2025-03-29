
import { useState } from 'react';
import { Day, EmployeeLevel, EmploymentType } from '@/types/common';

// Define a simplified award rate structure
interface AwardRate {
  level: EmployeeLevel;
  employmentType: EmploymentType;
  day: Day | 'publicHoliday';
  hourlyRate: number;
  loadingFactor?: number;
}

export function useAwardEngine() {
  const [awardRates, setAwardRates] = useState<AwardRate[]>([
    // Some example rates
    { level: 1, employmentType: 'full-time', day: 'monday', hourlyRate: 25.00 },
    { level: 1, employmentType: 'part-time', day: 'monday', hourlyRate: 25.00 },
    { level: 1, employmentType: 'casual', day: 'monday', hourlyRate: 31.25, loadingFactor: 1.25 },
    { level: 2, employmentType: 'full-time', day: 'monday', hourlyRate: 28.00 },
    // ... more rates would be defined here in a real implementation
  ]);

  // Calculate hours based on start and end time (HH:MM format)
  const calculateHours = (startTime: string, endTime: string, breakMinutes: number = 0): number => {
    try {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute) - breakMinutes;
      return Math.max(0, totalMinutes / 60);
    } catch (error) {
      console.error('Error calculating hours:', error);
      return 0;
    }
  };

  // Calculate cost for a shift
  const calculateShiftCost = (params: {
    day: Day;
    startTime: string;
    endTime: string;
    breakMinutes?: number;
    level: EmployeeLevel;
    employmentType: EmploymentType;
    numberOfCleaners?: number;
  }): number => {
    const { 
      day, 
      startTime, 
      endTime, 
      breakMinutes = 0, 
      level, 
      employmentType,
      numberOfCleaners = 1
    } = params;
    
    // Find matching rate
    const rate = awardRates.find(r => 
      r.level === level && 
      r.employmentType === employmentType && 
      r.day === day
    );
    
    if (!rate) {
      console.warn(`No rate found for: level ${level}, ${employmentType}, ${day}`);
      return 0;
    }
    
    const hours = calculateHours(startTime, endTime, breakMinutes);
    return rate.hourlyRate * hours * numberOfCleaners;
  };

  return {
    calculateShiftCost,
    calculateHours,
    awardRates,
    setAwardRates
  };
}

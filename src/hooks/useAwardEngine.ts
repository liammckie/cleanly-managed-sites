
import { useState, useEffect } from 'react';
import { calculateJobCost } from '@/lib/award/awardEngine';
import { JobCostCalculationInput, CostCalculationResult } from '@/lib/award/types';
import { cleaningServicesAward } from '@/lib/award/awardData';

export function useAwardEngine(quoteId?: string) {
  const [awardData, setAwardData] = useState<any>(cleaningServicesAward);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateShiftCost = (params: JobCostCalculationInput): CostCalculationResult => {
    return calculateJobCost(params);
  };

  const calculateHours = (startTime: string, endTime: string, breakDuration: number = 0): number => {
    try {
      // Parse hours and minutes for start time
      const [startHour, startMinute] = startTime.split(':').map(part => parseInt(part, 10));
      // Parse hours and minutes for end time
      const [endHour, endMinute] = endTime.split(':').map(part => parseInt(part, 10));
      
      // Convert to minutes
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      
      // Calculate duration in minutes
      let durationMinutes = endTotalMinutes - startTotalMinutes;
      
      // Handle crossing midnight
      if (durationMinutes < 0) {
        durationMinutes += 24 * 60;
      }
      
      // Subtract break duration
      durationMinutes -= breakDuration;
      
      // Convert to hours
      return durationMinutes / 60;
    } catch (error) {
      console.error("Error calculating hours:", error);
      return 0;
    }
  };

  const getLevelRate = (level: number): number => {
    const levelStr = String(level);
    return awardData.employeeLevelRates?.[levelStr] || 0;
  };

  const getConditionRate = (condition: string): number => {
    return awardData.conditionRates?.[condition] || 1;
  };

  return {
    awardData,
    loading,
    error,
    calculateShiftCost,
    calculateHours,
    getLevelRate,
    getConditionRate
  };
}

export default useAwardEngine;

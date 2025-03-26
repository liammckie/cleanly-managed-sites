
/**
 * Calculate the duration of a shift in hours
 * @param startTime - Shift start time in format "HH:MM"
 * @param endTime - Shift end time in format "HH:MM"
 * @param breakDuration - Break duration in minutes
 * @returns Duration in hours (with decimal for minutes)
 */
export const getShiftDurationHours = (
  startTime: string,
  endTime: string,
  breakDuration: number = 0
): number => {
  // Parse times into hours and minutes
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  // Convert to minutes since midnight
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  // Handle overnight shifts
  let durationMinutes = endTotalMinutes >= startTotalMinutes
    ? endTotalMinutes - startTotalMinutes
    : (24 * 60 - startTotalMinutes) + endTotalMinutes;
  
  // Subtract break time
  durationMinutes -= breakDuration;
  
  // Convert to hours (with decimal)
  return durationMinutes / 60;
};

/**
 * Calculate the cost of a shift based on hours, rate, and number of cleaners
 * @param hours - Shift duration in hours
 * @param hourlyRate - Hourly rate for the cleaner
 * @param numberOfCleaners - Number of cleaners for this shift
 * @returns Total cost for the shift
 */
export const calculateShiftCost = (
  hours: number,
  hourlyRate: number,
  numberOfCleaners: number = 1
): number => {
  return hours * hourlyRate * numberOfCleaners;
};

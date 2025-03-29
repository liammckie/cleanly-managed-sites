
// Define EmployeeLevel as an enum or type
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

// Export awardData for compatibility
export const awardData = {
  levels: [1, 2, 3, 4, 5],
  rates: {
    1: { hourlyRate: 22.5 },
    2: { hourlyRate: 23.7 },
    3: { hourlyRate: 24.8 },
    4: { hourlyRate: 26.0 },
    5: { hourlyRate: 27.5 }
  }
};

// Export the award settings
export const defaultAwardSettings = {
  baseRate: 22.5,
  casualLoading: 0.25,
  saturdayLoading: 0.5,
  sundayLoading: 0.75,
  eveningLoading: 0.15,
  publicHolidayLoading: 1.5
};

// Export the cleaning services award
export const cleaningServicesAward = {
  name: "Cleaning Services Award",
  levels: [
    { id: 1, name: "Level 1", baseRate: 22.5 },
    { id: 2, name: "Level 2", baseRate: 23.7 },
    { id: 3, name: "Level 3", baseRate: 24.8 },
    { id: 4, name: "Level 4", baseRate: 26.0 },
    { id: 5, name: "Level 5", baseRate: 27.5 }
  ],
  penalties: {
    casual: 0.25,
    saturday: 0.5,
    sunday: 0.75,
    publicHoliday: 1.5,
    evening: 0.15
  }
};

// Update the problematic value to match the EmployeeLevel type
const employeeLevel: EmployeeLevel = 5;

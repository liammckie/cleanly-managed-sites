
import { EmploymentType, EmployeeLevel } from "@/types/common";

/**
 * Maps employment types from frontend to backend and vice versa
 */
export const employmentTypeMap: Record<EmploymentType, string> = {
  'full-time': 'full_time',
  'part-time': 'part_time',
  casual: 'casual',
  contract: 'contract',
  intern: 'intern'
};

/**
 * Maps employment types from backend to frontend
 */
export const backendToFrontendEmploymentTypeMap: Record<string, EmploymentType> = {
  full_time: 'full-time',
  part_time: 'part-time',
  casual: 'casual',
  contract: 'contract',
  intern: 'intern'
};

/**
 * Validates if a value is a valid employee level
 * @param value Value to validate
 * @returns Validated employee level or default (1)
 */
export function validateEmployeeLevel(value: any): EmployeeLevel {
  const level = Number(value);
  if (isNaN(level) || level < 1 || level > 5) {
    return 1; // Default to level 1 if invalid
  }
  return level as EmployeeLevel;
}

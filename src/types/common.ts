
// Common enums and types used throughout the application

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type EmploymentType = 'full_time' | 'part_time' | 'casual';

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once';

export type BillingFrequency = 'weekly' | 'monthly' | 'quarterly' | 'annually';

export type QuoteStatus = 'draft' | 'pending' | 'sent' | 'submitted' | 'approved' | 'accepted' | 'declined' | 'rejected' | 'expired';

export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';

export type UserStatus = 'active' | 'pending' | 'inactive';

// Helper function to validate enum values
export function isValidEnumValue<T extends string>(value: string, enumValues: readonly T[]): value is T {
  return (enumValues as readonly string[]).includes(value);
}

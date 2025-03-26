
// Common type definitions shared across the application

export type Day = 
  | "monday" 
  | "tuesday" 
  | "wednesday" 
  | "thursday" 
  | "friday" 
  | "saturday" 
  | "sunday" 
  | "weekday" 
  | "public_holiday";

export type EmploymentType = "casual" | "part_time" | "full_time";

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // Added levels 7 and 8

export type BillingFrequency = 
  | "weekly" 
  | "fortnightly" 
  | "monthly" 
  | "quarterly" 
  | "annually" 
  | "one-time";

export type SiteStatus = 
  | "active" 
  | "pending" 
  | "inactive" 
  | "on-hold"
  | "on_hold"  // Added for compatibility
  | "lost";

export type Frequency = 
  | "daily" 
  | "weekly" 
  | "fortnightly" 
  | "monthly" 
  | "quarterly" 
  | "yearly" 
  | "once"
  | "annually"
  | "one_time"
  | "one-time"
  | "per_event";

// JSON utility type
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

// Export Json as a type alias for backward compatibility
export type Json = JsonValue;

// Quote status type
export type QuoteStatus = "draft" | "sent" | "approved" | "rejected" | "expired" | "pending" | "accepted";

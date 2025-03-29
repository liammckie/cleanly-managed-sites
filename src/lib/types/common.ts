
// JSON type for use in database operations
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
export type Json = JsonValue;

// Common status types used across the application
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';
export type QuoteStatus = 'draft' | 'pending' | 'sent' | 'approved' | 'accepted' | 'rejected' | 'expired';
export type WorkOrderStatus = 'draft' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';
export type EmploymentType = 'full_time' | 'part_time' | 'casual' | 'contract' | 'intern';
export type EmployeeLevel = 1 | 2 | 3 | 4;

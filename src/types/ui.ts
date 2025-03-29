
/**
 * UI-specific types
 */

// Badge variants for consistent styling
export type BadgeVariant = 
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning';

// Button variants
export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

// Common table pagination state
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

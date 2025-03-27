
import { JsonValue } from './common';

/**
 * API response type
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  statusCode: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

/**
 * API error
 */
export interface ApiError {
  message: string;
  statusCode: number;
  details?: JsonValue;
}

/**
 * Request body with generic type
 */
export interface RequestBody<T> {
  data: T;
}


/**
 * Central export point for all adapters
 */

// Export registry for extensions
export { typeRegistry, type FieldMapping, type TypeMappingConfig } from './typeRegistry';

// Export all adapters
export * from './contractAdapter';
export * from './siteAdapter';
export * from './userAdapter';
export * from './billingAdapter';

// Export utility functions
export { snakeToCamel, camelToSnake } from './utils';


/**
 * Type Registry - Central registration system for database and frontend types
 * Provides consistent mapping between database (snake_case) and frontend (camelCase) formats
 */
import { Json } from '@/lib/types/common';

/**
 * Field Mapping Configuration
 * Defines explicit mappings between frontend and database field names
 */
export interface FieldMapping {
  // Frontend (camelCase) field name
  frontend: string;
  // Database (snake_case) field name
  database: string;
  // Optional transformation function for complex conversions
  transform?: (value: any, direction: 'toDb' | 'fromDb') => any;
}

/**
 * Type Mapping Configuration
 * Defines mapping between a frontend type and database type
 */
export interface TypeMappingConfig<F, D> {
  // Name of the type (for debugging and reference)
  name: string;
  // Field mappings for this type
  fields: FieldMapping[];
  // Optional custom transformation for complex objects
  customTransform?: {
    toDb?: (frontendData: F) => D;
    fromDb?: (dbData: D) => F;
  };
}

/**
 * Type Registry - Stores all type mappings
 */
class TypeRegistry {
  private mappings: Record<string, TypeMappingConfig<any, any>> = {};

  /**
   * Register a new type mapping
   */
  register<F, D>(config: TypeMappingConfig<F, D>): void {
    this.mappings[config.name] = config;
  }

  /**
   * Get a type mapping by name
   */
  getMapping(name: string): TypeMappingConfig<any, any> | undefined {
    return this.mappings[name];
  }

  /**
   * Create adapter functions for a registered type
   */
  createAdapter<F, D>(typeName: string) {
    const mapping = this.getMapping(typeName);
    
    if (!mapping) {
      throw new Error(`Type mapping "${typeName}" not registered`);
    }

    return {
      toDb: (frontendData: F): D => this.convertToDb<F, D>(frontendData, mapping),
      fromDb: (dbData: D): F => this.convertFromDb<F, D>(dbData, mapping),
      manyToDb: (frontendDataArray: F[]): D[] => 
        frontendDataArray.map(item => this.convertToDb<F, D>(item, mapping)),
      manyFromDb: (dbDataArray: D[]): F[] => 
        dbDataArray.map(item => this.convertFromDb<F, D>(item, mapping)),
    };
  }

  /**
   * Convert frontend format to database format using mapping
   */
  private convertToDb<F, D>(data: F, mapping: TypeMappingConfig<F, D>): D {
    // Use custom transform if provided
    if (mapping.customTransform?.toDb) {
      return mapping.customTransform.toDb(data);
    }

    // Standard field-by-field mapping
    const result = {} as any;
    
    // Process all explicitly mapped fields
    for (const field of mapping.fields) {
      const frontendValue = (data as any)[field.frontend];
      
      // Skip undefined values
      if (frontendValue === undefined) continue;
      
      // Apply field transform if exists or use value directly
      if (field.transform) {
        result[field.database] = field.transform(frontendValue, 'toDb');
      } else {
        result[field.database] = frontendValue;
      }
    }
    
    // Handle any remaining fields using standard camelToSnake conversion
    for (const key in data) {
      // Skip already mapped fields
      if (mapping.fields.some(f => f.frontend === key)) continue;
      
      const snakeKey = this.camelToSnake(key);
      result[snakeKey] = (data as any)[key];
    }
    
    return result as D;
  }

  /**
   * Convert database format to frontend format using mapping
   */
  private convertFromDb<F, D>(data: D, mapping: TypeMappingConfig<F, D>): F {
    // Use custom transform if provided
    if (mapping.customTransform?.fromDb) {
      return mapping.customTransform.fromDb(data);
    }

    // Standard field-by-field mapping
    const result = {} as any;
    
    // Process all explicitly mapped fields
    for (const field of mapping.fields) {
      const dbValue = (data as any)[field.database];
      
      // Skip undefined values
      if (dbValue === undefined) continue;
      
      // Apply field transform if exists or use value directly
      if (field.transform) {
        result[field.frontend] = field.transform(dbValue, 'fromDb');
      } else {
        result[field.frontend] = dbValue;
      }
    }
    
    // Handle any remaining fields using standard snakeToCamel conversion
    for (const key in data) {
      // Skip already mapped fields
      if (mapping.fields.some(f => f.database === key)) continue;
      
      const camelKey = this.snakeToCamel(key);
      result[camelKey] = (data as any)[key];
    }
    
    return result as F;
  }

  /**
   * Convert snake_case to camelCase
   */
  private snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Convert camelCase to snake_case
   */
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

// Export singleton instance
export const typeRegistry = new TypeRegistry();

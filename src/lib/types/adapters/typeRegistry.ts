
/**
 * Type Registry
 * A centralized system for registering and managing data type mappings between
 * frontend and database representations.
 */

import { camelToSnakeObject, snakeToCamelObject } from './utils';

// Field mapping definition
export interface FieldMapping {
  frontend: string;
  database: string;
  transform?: (value: any, direction: 'toDb' | 'fromDb', context?: any) => any;
}

// Type mapping configuration
export interface TypeMappingConfig {
  name: string;
  fields: FieldMapping[];
}

// Type adapter interface
export interface TypeAdapter<FrontendType, DatabaseType> {
  toDb: (frontendData: Partial<FrontendType>) => Partial<DatabaseType>;
  fromDb: (dbData: Partial<DatabaseType>) => Partial<FrontendType>;
}

// The registry class
class TypeRegistryClass {
  private mappings: Record<string, TypeMappingConfig> = {};
  
  // Register a new type mapping
  register<FrontendType, DatabaseType>(config: TypeMappingConfig): void {
    this.mappings[config.name] = config;
  }
  
  // Get a registered mapping by name
  getMapping(name: string): TypeMappingConfig | undefined {
    return this.mappings[name];
  }
  
  // Create an adapter for a specific type mapping
  createAdapter<FrontendType, DatabaseType>(
    mappingName: string
  ): TypeAdapter<FrontendType, DatabaseType> {
    const mapping = this.getMapping(mappingName);
    
    if (!mapping) {
      throw new Error(`Type mapping "${mappingName}" not found in registry`);
    }
    
    // Create to-database adapter function
    const toDb = (frontendData: Partial<FrontendType>): Partial<DatabaseType> => {
      if (!frontendData) return {} as Partial<DatabaseType>;
      
      const result: Record<string, any> = {};
      
      // Apply specific field mappings
      mapping.fields.forEach(field => {
        const frontendValue = (frontendData as any)[field.frontend];
        
        if (frontendValue !== undefined) {
          // Apply custom transform or use the value as is
          const dbValue = field.transform 
            ? field.transform(frontendValue, 'toDb') 
            : frontendValue;
          
          result[field.database] = dbValue;
        }
      });
      
      return result as Partial<DatabaseType>;
    };
    
    // Create from-database adapter function
    const fromDb = (dbData: Partial<DatabaseType>): Partial<FrontendType> => {
      if (!dbData) return {} as Partial<FrontendType>;
      
      const result: Record<string, any> = {};
      
      // Apply specific field mappings
      mapping.fields.forEach(field => {
        const dbValue = (dbData as any)[field.database];
        
        if (dbValue !== undefined) {
          // Apply custom transform or use the value as is
          const frontendValue = field.transform 
            ? field.transform(dbValue, 'fromDb') 
            : dbValue;
          
          result[field.frontend] = frontendValue;
        }
      });
      
      return result as Partial<FrontendType>;
    };
    
    return { toDb, fromDb };
  }
  
  // Generic function to transform an object from camelCase to snake_case
  toSnakeCase<T>(obj: T): Record<string, any> {
    return camelToSnakeObject(obj);
  }
  
  // Generic function to transform an object from snake_case to camelCase
  toCamelCase<T>(obj: T): Record<string, any> {
    return snakeToCamelObject(obj);
  }
}

// Export a singleton instance
export const typeRegistry = new TypeRegistryClass();

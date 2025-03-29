
/**
 * Converts string properties to numeric values where needed
 */
export function convertStringToNumeric(obj: Record<string, any>): Record<string, any> {
  const result = { ...obj };
  
  // Fields that should be numeric
  const numericFields = [
    'value', 'amount', 'totalPrice', 'laborCost', 'overheadPercentage', 
    'marginPercentage', 'subcontractorCost', 'renewalPeriod', 'contractLength'
  ];
  
  for (const field of numericFields) {
    if (field in result && typeof result[field] === 'string') {
      result[field] = parseFloat(result[field]);
    }
  }
  
  return result;
}

/**
 * Creates a TypeScript interface string from an object example
 * Helps with debugging type issues
 */
export function generateTypeFromObject(obj: any, interfaceName: string = 'GeneratedType'): string {
  const lines: string[] = [];
  lines.push(`interface ${interfaceName} {`);
  
  for (const [key, value] of Object.entries(obj)) {
    const type = Array.isArray(value) 
      ? 'any[]' 
      : typeof value === 'object' && value !== null 
        ? 'Record<string, any>' 
        : typeof value;
    
    lines.push(`  ${key}: ${type};`);
  }
  
  lines.push('}');
  return lines.join('\n');
}

/**
 * Safely converts any value to a JSON string, handling circular references
 */
export function safeJsonStringify(obj: any): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  }, 2);
}

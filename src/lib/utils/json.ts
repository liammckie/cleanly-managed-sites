
/**
 * Safely parses a JSON string with a fallback default value
 * @param jsonString The JSON string to parse
 * @param defaultValue The default value to return if parsing fails
 * @returns The parsed object or the default value
 */
export function safeParseJson<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}

/**
 * Safely extracts a property from a JSON object with type safety
 * @param json The JSON object
 * @param property The property name to extract
 * @param defaultValue The default value to return if property doesn't exist
 * @returns The property value or the default value
 */
export function getJsonProperty<T>(
  json: any,
  property: string,
  defaultValue: T
): T {
  if (!json || typeof json !== 'object' || json === null) {
    return defaultValue;
  }
  
  if (Object.prototype.hasOwnProperty.call(json, property)) {
    return json[property] as T;
  }
  
  return defaultValue;
}

/**
 * Safely casts a JSON value to a specific type with a fallback
 * @param json The JSON value to cast
 * @param defaultValue The default value to return if casting fails
 * @returns The casted value or default value
 */
export function asJsonObject<T extends object>(
  json: any,
  defaultValue: T
): T {
  if (!json) return defaultValue;
  
  // If already an object, return as is
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return json as T;
  }
  
  // If it's a string, try to parse it
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed as T;
      }
    } catch (error) {
      console.error('Error parsing JSON string:', error);
    }
  }
  
  return defaultValue;
}

/**
 * Converts a JSON value to a typed value with validation
 * @param jsonValue The JSON value to convert
 * @param typeValidator A function to validate and convert the type
 * @param defaultValue The default value to return if conversion fails
 * @returns The converted value or default value
 */
export function convertJsonToType<T>(
  jsonValue: any,
  typeValidator: (value: any) => T | null,
  defaultValue: T
): T {
  try {
    const converted = typeValidator(jsonValue);
    return converted !== null ? converted : defaultValue;
  } catch (error) {
    console.error('Error converting JSON to type:', error);
    return defaultValue;
  }
}

/**
 * Safely stringifies a value to JSON with error handling
 * @param value The value to stringify
 * @returns The JSON string or undefined if stringification fails
 */
export function safeStringifyJson(value: any): string | undefined {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Error stringifying to JSON:', error);
    return undefined;
  }
}

/**
 * Parses a JSON string and ensures it's an object
 */
export function parseJson(jsonString: string | null | undefined): Record<string, any> | null {
  if (!jsonString) return null;
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

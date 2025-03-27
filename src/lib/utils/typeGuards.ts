
/**
 * Type guards for checking JavaScript types
 */

export function isObject(val: unknown): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export function isArray(val: unknown): val is Array<any> {
  return Array.isArray(val);
}

export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

export function isNumber(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val);
}

export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean';
}

export function isDate(val: unknown): val is Date {
  return val instanceof Date;
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

export function isUndefined(val: unknown): val is undefined {
  return typeof val === 'undefined';
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isNullOrUndefined(val: unknown): val is null | undefined {
  return isNull(val) || isUndefined(val);
}

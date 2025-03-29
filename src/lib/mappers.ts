
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

/**
 * Convert an object from camelCase keys to snake_case keys (deep conversion).
 */
export const mapToDb = <T extends object>(obj: T): T => {
  return snakecaseKeys(obj, { deep: true }) as T;
};

/**
 * Convert an object from snake_case keys to camelCase keys (deep conversion).
 */
export const mapFromDb = <T extends object>(obj: T): T => {
  return camelcaseKeys(obj, { deep: true }) as T;
};

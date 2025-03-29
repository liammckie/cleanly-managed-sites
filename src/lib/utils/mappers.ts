
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

/**
 * Convert an object with camelCase keys to snake_case keys for database operations.
 * This function performs a deep conversion.
 */
export const mapToDb = <T extends Record<string, any>>(obj: T): T => {
  return snakecaseKeys(obj, { deep: true }) as T;
};

/**
 * Convert an object with snake_case keys from the database to camelCase keys for use in the app.
 * This function performs a deep conversion.
 */
export const mapFromDb = <T extends Record<string, any>>(obj: T): T => {
  return camelcaseKeys(obj, { deep: true }) as T;
};

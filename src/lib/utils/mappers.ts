
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

/**
 * Convert an object with camelCase keys to snake_case keys for database operations.
 * This function performs a deep conversion.
 */
export const mapToDb = <T extends object>(obj: T): Record<string, any> => {
  return snakecaseKeys(obj, { deep: true });
};

/**
 * Convert an object with snake_case keys from the database to camelCase keys for use in the app.
 * This function performs a deep conversion.
 */
export const mapFromDb = <T extends object>(obj: T): Record<string, any> => {
  return camelcaseKeys(obj, { deep: true });
};

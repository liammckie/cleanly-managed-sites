
import Papa from 'papaparse';

/**
 * Parse a CSV file or string into an array of objects
 * @param input CSV file or string
 * @returns Parsed data as array of objects
 */
export async function parseCSV(input: File | string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          // Convert headers to camelCase or snake_case as needed
          return header.trim().toLowerCase().replace(/\s+/g, '_');
        },
        complete: (results: Papa.ParseResult<any>) => {
          resolve(results.data);
        },
        error: (error: Papa.ParseError) => {
          reject(new Error(`CSV parse error: ${error.message}`));
        }
      };
      
      if (typeof input === 'string') {
        Papa.parse(input, options);
      } else if (input instanceof File) {
        Papa.parse(input, { ...options, download: false });
      } else {
        reject(new Error('Invalid input: must be a string or File'));
      }
    } catch (error) {
      reject(error);
    }
  });
}


import { parse } from 'papaparse';

/**
 * Takes a CSV file and returns the parsed data as an array of objects
 * @param file The CSV file to parse
 * @param options Parse options
 * @returns Promise with parsed data
 */
export async function parseCSV(file: File, options: any = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!e.target || !e.target.result) {
        reject(new Error('Error reading file'));
        return;
      }
      
      const csv = e.target.result as string;
      
      parse(csv, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
        ...options
      });
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    // Read the file as text
    reader.readAsText(file);
  });
}

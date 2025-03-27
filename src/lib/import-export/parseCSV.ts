
import Papa from 'papaparse';

export function parseCSV<T = any>(csvString: string): T[] {
  try {
    const result = Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (result.errors && result.errors.length > 0) {
      console.error('CSV parsing errors:', result.errors);
      throw new Error(`Error parsing CSV: ${result.errors[0].message}`);
    }

    return result.data as T[];
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
}

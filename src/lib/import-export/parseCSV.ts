
import Papa from 'papaparse';

export async function parseCSV<T = any>(input: string | File): Promise<T[]> {
  try {
    let csvString: string;
    
    if (input instanceof File) {
      csvString = await readFileAsText(input);
    } else {
      csvString = input;
    }
    
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

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

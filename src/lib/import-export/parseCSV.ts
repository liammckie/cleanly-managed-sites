
/**
 * Parse CSV data into an array of objects
 * 
 * @param input - CSV string or File object
 * @returns Array of objects representing CSV rows
 */
export const parseCSV = async (input: string | File): Promise<any[]> => {
  try {
    let csvText: string;
    
    // Handle both string and File inputs
    if (typeof input === 'string') {
      csvText = input;
    } else if (input instanceof File) {
      csvText = await readFileAsText(input);
    } else {
      throw new Error('Invalid input type. Expected string or File.');
    }
    
    // Split the CSV text into lines
    const lines = csvText.split(/\r?\n/).filter(line => line.trim());
    
    // Get the headers from the first line
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Parse the data rows
    const results = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',').map(value => value.trim());
      
      // Skip empty lines
      if (currentLine.length === 1 && currentLine[0] === '') continue;
      
      // Create an object for the current row
      const obj: Record<string, any> = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
      }
      
      results.push(obj);
    }
    
    return results;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
};

/**
 * Read a File object as text
 * 
 * @param file - File object to read
 * @returns Promise resolving to file contents as string
 */
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

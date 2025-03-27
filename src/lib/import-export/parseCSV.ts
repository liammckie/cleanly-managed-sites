
/**
 * Parse CSV file to JSON array
 */
export const parseCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        if (!csv) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        // Simple CSV parsing
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        const result = lines.slice(1).filter(line => line.trim().length > 0).map(line => {
          const values = line.split(',').map(value => value.trim());
          const obj: Record<string, any> = {};
          
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          
          return obj;
        });
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

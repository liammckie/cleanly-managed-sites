
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
      
      // Import parse from papaparse dynamically to avoid type errors
      import('papaparse').then(({ parse }) => {
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
      }).catch(err => {
        reject(new Error('Error loading CSV parser: ' + err.message));
      });
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    // Read the file as text
    reader.readAsText(file);
  });
}

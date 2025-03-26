
import Papa from 'papaparse';

export const parseImportedFile = async (file: File): Promise<any[]> => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExt === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } else if (fileExt === 'json') {
    const text = await file.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error('Invalid JSON file');
    }
  } else {
    throw new Error('Unsupported file type. Please upload a CSV or JSON file.');
  }
};

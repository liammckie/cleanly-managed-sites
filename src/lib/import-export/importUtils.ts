
import { supabase } from '../supabase';

// Parse an imported file (JSON or CSV)
export const parseImportedFile = async (file: File): Promise<any> => {
  try {
    const text = await file.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error parsing imported file:', error);
    throw new Error('Invalid file format. Please ensure the file is valid JSON.');
  }
};

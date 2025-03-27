
import { useState } from 'react';
import { toast } from 'sonner';
import { importData, parseUnifiedImportFile } from '@/lib/import-export';
import { ImportOptions } from '@/types/models';

export function useUnifiedImport() {
  const [isImporting, setIsImporting] = useState(false);
  
  const handleUnifiedImportMode = async (file: File, mode: 'full' | 'incremental') => {
    try {
      setIsImporting(true);
      const data = await parseUnifiedImportFile(file);
      
      const options: ImportOptions = {
        format: 'json',
        type: 'unified',
        mode
      };
      
      const result = await importData(data, options);
      
      toast.success(`Import completed: ${result.imported || 0} records imported`);
      return result;
      
    } catch (error: any) {
      console.error('Unified import error:', error);
      toast.error(`Import failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsImporting(false);
    }
  };
  
  return {
    isImporting,
    handleUnifiedImportMode
  };
}

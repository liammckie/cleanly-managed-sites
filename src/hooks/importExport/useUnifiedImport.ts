
import { toast } from 'sonner';
import { handleUnifiedImport } from '@/lib/import-export';
import { ImportOptions } from '@/lib/import-export/types';

export function useUnifiedImport() {
  const handleImport = async (file: File, options: { mode: 'full' | 'incremental' }): Promise<void> => {
    try {
      // Create a complete ImportOptions object
      const importOptions: ImportOptions = {
        format: 'csv',
        type: 'unified',
        mode: options.mode
      };
      
      await handleUnifiedImport(file, importOptions, true);
      toast.success('Import completed successfully');
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
      throw error;
    }
  };

  return {
    handleUnifiedImport: handleImport
  };
}

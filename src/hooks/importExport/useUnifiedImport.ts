
import { toast } from 'sonner';
import { handleUnifiedImport as handleUnifiedImportFn } from '@/lib/import-export';

export function useUnifiedImport() {
  const handleUnifiedImport = async (file: File, options: { mode: 'full' | 'incremental' }): Promise<void> => {
    try {
      await handleUnifiedImportFn(file, options);
      toast.success('Import completed successfully');
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
      throw error;
    }
  };

  return {
    handleUnifiedImport
  };
}

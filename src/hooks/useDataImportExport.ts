
import { useDataImportExport as useDataImportExportInternal } from './importExport/useDataImportExport';

// Re-export the hook with the same name to maintain backwards compatibility
export const useDataImportExport = useDataImportExportInternal;

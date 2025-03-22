
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, FileDown, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  exportClients, 
  exportSites, 
  exportContracts,
  parseImportedFile,
  validateClientData,
  validateSiteData,
  validateContractData
} from '@/lib/exportImport';

type DataType = 'clients' | 'sites' | 'contracts';

interface ImportExportCardProps {
  type: DataType;
  data: any[];
  onImport: (data: any[]) => Promise<void>;
  title: string;
  description: string;
}

export const ImportExportCard: React.FC<ImportExportCardProps> = ({
  type,
  data,
  onImport,
  title,
  description
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  
  const handleExport = () => {
    try {
      switch (type) {
        case 'clients':
          exportClients(data);
          break;
        case 'sites':
          exportSites(data);
          break;
        case 'contracts':
          exportContracts(data);
          break;
      }
      toast.success(`${title} exported successfully`);
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      toast.error(`Failed to export ${title}`);
    }
  };
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    try {
      const importedData = await parseImportedFile(file);
      
      // Validate data structure based on type
      let isValid = false;
      switch (type) {
        case 'clients':
          isValid = validateClientData(importedData);
          break;
        case 'sites':
          isValid = validateSiteData(importedData);
          break;
        case 'contracts':
          isValid = validateContractData(importedData);
          break;
      }
      
      if (!isValid) {
        throw new Error(`Invalid ${type} data format`);
      }
      
      // Process import
      await onImport(importedData);
      toast.success(`${title} imported successfully`);
      
      // Reset file input
      event.target.value = '';
    } catch (error: any) {
      console.error(`Error importing ${type}:`, error);
      setImportError(error.message || `Failed to import ${title}`);
      toast.error(error.message || `Failed to import ${title}`);
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleExport}
            disabled={data.length === 0}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export {title}
          </Button>
          
          <div className="relative">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById(`import-${type}`)?.click()}
              disabled={isImporting}
            >
              <FileUp className="mr-2 h-4 w-4" />
              Import {title}
            </Button>
            <input
              id={`import-${type}`}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              disabled={isImporting}
            />
          </div>
          
          {importError && (
            <div className="bg-destructive/20 p-3 rounded-md flex items-start mt-2">
              <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{importError}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

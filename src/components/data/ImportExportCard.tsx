
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, FileDown, AlertCircle, FileSpreadsheet, FileJson, HelpCircle } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type DataType = 'clients' | 'sites' | 'contracts';

interface ImportExportCardProps {
  type: DataType;
  data: any[];
  onImport: (data: any[]) => Promise<void>;
  title: string;
  description: string;
  onCSVImport?: (file: File) => Promise<void>;
  getCSVTemplate?: () => string;
}

export const ImportExportCard: React.FC<ImportExportCardProps> = ({
  type,
  data,
  onImport,
  title,
  description,
  onCSVImport,
  getCSVTemplate
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
      // Check if it's a CSV or JSON file
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExt === 'csv' && onCSVImport) {
        await onCSVImport(file);
      } else if (fileExt === 'json') {
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
      } else {
        throw new Error('Unsupported file type. Please upload a CSV or JSON file.');
      }
      
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
  
  const downloadCSVTemplate = () => {
    if (!getCSVTemplate) return;
    
    const csvContent = getCSVTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}-template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {getCSVTemplate && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Import Instructions</h4>
                  <p className="text-sm text-muted-foreground">
                    You can import {title.toLowerCase()} using CSV or JSON format.
                    Download a template to see the required format.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Important:</strong> For site imports, make sure client_id matches existing clients.
                    For contract imports, ensure site_id matches existing sites.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
            </TabsList>
            
            <TabsContent value="export">
              <div className="py-2 space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleExport}
                  disabled={data.length === 0}
                >
                  <FileJson className="mr-2 h-4 w-4" />
                  Export as JSON
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="import">
              <div className="py-2 space-y-4">
                {getCSVTemplate && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={downloadCSVTemplate}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Download CSV Template
                  </Button>
                )}
                
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById(`import-${type}`)?.click()}
                    disabled={isImporting}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Import {title} (CSV or JSON)
                  </Button>
                  <input
                    id={`import-${type}`}
                    type="file"
                    accept=".json,.csv"
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
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileUp, FileDown, AlertCircle, FileSpreadsheet, 
  FileJson, HelpCircle, CheckCircle, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { 
  exportClients, 
  exportSites, 
  exportContracts,
  parseImportedFile
} from '@/lib/exportImport';
import {
  validateClientData,
  validateSiteData,
  validateContractData,
  ValidationResult
} from '@/lib/importValidation';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [fileType, setFileType] = useState<'json' | 'csv'>('json');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  
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
  
  const validateData = (data: any[], fileType: 'json' | 'csv'): ValidationResult => {
    let result: ValidationResult;
    
    switch (type) {
      case 'clients':
        result = validateClientData(data);
        break;
      case 'sites':
        result = validateSiteData(data);
        break;
      case 'contracts':
        result = validateContractData(data);
        break;
      default:
        result = { isValid: false, errors: [], warnings: [], data: [] };
    }
    
    return result;
  };
  
  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setValidationResult(null);
    setParsedData(null);
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    setCurrentFile(file);
    setIsImporting(true);
    
    try {
      // Check if it's a CSV or JSON file
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      setFileType(fileExt === 'csv' ? 'csv' : 'json');
      
      let importedData: any[];
      
      if (fileExt === 'csv') {
        // For CSV files, use Papa.parse
        importedData = await new Promise((resolve, reject) => {
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
        // For JSON files, use the existing parseImportedFile
        importedData = await parseImportedFile(file);
      } else {
        throw new Error('Unsupported file type. Please upload a CSV or JSON file.');
      }
      
      // Store parsed data
      setParsedData(importedData);
      
      // Validate the data
      const validationResult = validateData(importedData, fileExt as 'json' | 'csv');
      setValidationResult(validationResult);
      
      // Show validation dialog
      setShowValidationDialog(true);
    } catch (error: any) {
      console.error(`Error importing ${type}:`, error);
      setImportError(error.message || `Failed to import ${title}`);
      toast.error(error.message || `Failed to import ${title}`);
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleConfirmImport = async () => {
    if (!parsedData || !validationResult) return;
    
    setIsImporting(true);
    
    try {
      if (fileType === 'csv' && onCSVImport && currentFile) {
        await onCSVImport(currentFile);
      } else {
        await onImport(parsedData);
      }
      
      toast.success(`${title} imported successfully`);
      setShowValidationDialog(false);
      setParsedData(null);
      setValidationResult(null);
      
      // Reset file input
      const fileInput = document.getElementById(`import-${type}`) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
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
    <>
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
                      onChange={handleFileSelection}
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
      
      {/* Validation Dialog */}
      <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Validate Import Data</DialogTitle>
            <DialogDescription>
              Review the validation results before confirming the import.
            </DialogDescription>
          </DialogHeader>
          
          {validationResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {validationResult.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="font-medium">
                  {validationResult.isValid 
                    ? "Data is valid and ready to import" 
                    : "Data contains errors that must be fixed before importing"}
                </span>
              </div>
              
              {validationResult.errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                    Errors ({validationResult.errors.length})
                  </h4>
                  <ScrollArea className="h-[200px] rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Field</TableHead>
                          <TableHead>Issue</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResult.errors.map((error, index) => (
                          <TableRow key={`error-${index}`}>
                            <TableCell>{error.row}</TableCell>
                            <TableCell>{error.field}</TableCell>
                            <TableCell>{error.message}</TableCell>
                            <TableCell>{JSON.stringify(error.value)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
              
              {validationResult.warnings.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    Warnings ({validationResult.warnings.length})
                  </h4>
                  <ScrollArea className="h-[200px] rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Field</TableHead>
                          <TableHead>Issue</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResult.warnings.map((warning, index) => (
                          <TableRow key={`warning-${index}`}>
                            <TableCell>{warning.row}</TableCell>
                            <TableCell>{warning.field}</TableCell>
                            <TableCell>{warning.message}</TableCell>
                            <TableCell>{JSON.stringify(warning.value)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-2">Data Summary</h4>
                <p className="text-sm text-muted-foreground">
                  {parsedData?.length} {title.toLowerCase()} will be imported.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowValidationDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmImport} 
              disabled={!validationResult?.isValid || isImporting}
            >
              {isImporting ? "Importing..." : "Confirm Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

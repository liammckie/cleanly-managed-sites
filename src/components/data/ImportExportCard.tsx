
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
  parseImportedFile,
  generateUnifiedImportTemplate
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type DataType = 'clients' | 'sites' | 'contracts' | 'unified';

interface ImportExportCardProps {
  type: DataType;
  data: any[];
  onImport: (data: any[]) => Promise<void>;
  title: string;
  description: string;
  onCSVImport?: (file: File) => Promise<void>;
  getCSVTemplate?: () => string;
  onUnifiedImport?: (file: File, options: { mode: 'full' | 'incremental' }) => Promise<void>;
}

export const ImportExportCard: React.FC<ImportExportCardProps> = ({
  type,
  data,
  onImport,
  title,
  description,
  onCSVImport,
  getCSVTemplate,
  onUnifiedImport
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [fileType, setFileType] = useState<'json' | 'csv'>('json');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<'full' | 'incremental'>('incremental');
  
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
        case 'unified':
          // Export all types of data to a unified CSV
          const csv = generateUnifiedImportTemplate();
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `unified-import-template.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
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
      case 'unified':
        // For unified imports, we'll validate each record type separately
        const clientRecords = data.filter(record => record.record_type === 'client');
        const siteRecords = data.filter(record => record.record_type === 'site');
        const contractRecords = data.filter(record => record.record_type === 'contract');
        
        // Combine validation results
        const clientValidation = clientRecords.length > 0 ? validateClientData(clientRecords) : { isValid: true, errors: [], warnings: [], data: [] };
        const siteValidation = siteRecords.length > 0 ? validateSiteData(siteRecords) : { isValid: true, errors: [], warnings: [], data: [] };
        const contractValidation = contractRecords.length > 0 ? validateContractData(contractRecords) : { isValid: true, errors: [], warnings: [], data: [] };
        
        result = {
          isValid: clientValidation.isValid && siteValidation.isValid && contractValidation.isValid,
          errors: [...clientValidation.errors, ...siteValidation.errors, ...contractValidation.errors],
          warnings: [...clientValidation.warnings, ...siteValidation.warnings, ...contractValidation.warnings],
          data: [...clientValidation.data, ...siteValidation.data, ...contractValidation.data]
        };
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
      if (type === 'unified' && onUnifiedImport && currentFile) {
        await onUnifiedImport(currentFile, { mode: importMode });
      } else if (fileType === 'csv' && onCSVImport && currentFile) {
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
    if (type === 'unified') {
      // For unified template
      const csv = generateUnifiedImportTemplate();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `unified-import-template.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (getCSVTemplate) {
      // For individual entity templates
      const csvContent = getCSVTemplate();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-template.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
                  {type === 'unified' ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        <strong>Unified Import:</strong> This template allows you to import clients, sites, and contracts all in one file.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Incremental Mode:</strong> Only adds new records or updates specified ones.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Full Import Mode:</strong> Replaces all existing data with the imported data.
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      <strong>Important:</strong> For site imports, make sure client_id matches existing clients.
                      For contract imports, ensure site_id matches existing sites.
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
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
                    disabled={type !== 'unified' && data.length === 0}
                  >
                    {type === 'unified' ? (
                      <>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Download Unified CSV Template
                      </>
                    ) : (
                      <>
                        <FileJson className="mr-2 h-4 w-4" />
                        Export as JSON
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="import">
                <div className="py-2 space-y-4">
                  {(getCSVTemplate || type === 'unified') && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={downloadCSVTemplate}
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Download {type === 'unified' ? 'Unified' : ''} CSV Template
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
                      Import {title} {type === 'unified' ? '(Unified CSV or JSON)' : '(CSV or JSON)'}
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
              
              {type === 'unified' && (
                <div className="space-y-2 border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Import Mode</h4>
                  <RadioGroup value={importMode} onValueChange={(value) => setImportMode(value as 'full' | 'incremental')}>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="incremental" id="incremental" />
                      <div className="grid gap-1">
                        <Label htmlFor="incremental" className="font-medium">Incremental Import</Label>
                        <p className="text-sm text-muted-foreground">
                          Only add new records or update existing ones identified by ID or custom_id.
                          Existing records not in the import file will be kept.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 mt-2">
                      <RadioGroupItem value="full" id="full" />
                      <div className="grid gap-1">
                        <Label htmlFor="full" className="font-medium">Full Import</Label>
                        <p className="text-sm text-muted-foreground">
                          Replace all existing data with the imported data.
                          This will delete any records not included in the import file.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
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

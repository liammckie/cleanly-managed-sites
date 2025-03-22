
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText, Table as TableIcon } from 'lucide-react';

export const ImportExportInstructions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import/Export Instructions</CardTitle>
        <CardDescription>
          Learn how to import and export data in your system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="import">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import Instructions</TabsTrigger>
            <TabsTrigger value="export">Export Instructions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-4 pt-4">
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important Information</AlertTitle>
              <AlertDescription>
                Before importing data, ensure your CSV or JSON files follow the correct format.
                Use the provided templates for guidance.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Import Options</h3>
                <p className="text-sm text-muted-foreground">
                  You can import data in two ways:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong>Unified Import:</strong> Import clients, sites, and contracts all in one file</li>
                  <li><strong>Individual Import:</strong> Import each data type separately</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Unified Import</h3>
                <p className="text-sm text-muted-foreground">
                  The unified import allows you to import all data types in a single operation:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Download the unified template to see the required format</li>
                  <li>Each row specifies a record type (client, site, or contract)</li>
                  <li>You can use the 'action' column to specify create, update, or delete operations</li>
                  <li>Choose between incremental import (adding/updating records) or full import (replacing all data)</li>
                  <li>You can reference records by custom_id with "custom:" prefix (e.g., "custom:CL001")</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">CSV vs JSON Format</h3>
                <p className="text-sm text-muted-foreground">
                  For both individual and unified imports, you can use either CSV or JSON format:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong>CSV:</strong> Easier to edit in spreadsheet applications like Excel</li>
                  <li><strong>JSON:</strong> Better for complex nested data and programmatic use</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Field Relationships</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure you maintain proper relationships between data types:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Sites must reference valid client_ids</li>
                  <li>Contracts must reference valid site_ids</li>
                  <li>You can use custom_ids to create these relationships (with "custom:" prefix)</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Validation</h3>
                <p className="text-sm text-muted-foreground">
                  Before importing, the system will validate your data and show:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong>Errors:</strong> Must be fixed before import can proceed</li>
                  <li><strong>Warnings:</strong> Potential issues that won't block import</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Test Data</h3>
                <p className="text-sm text-muted-foreground">
                  You can use the "Create Test Data" button to generate sample data with correct relationships for testing purposes.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Export Options</h3>
                <p className="text-sm text-muted-foreground">
                  You can export your data in different formats:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong>Individual Exports:</strong> Export clients, sites, or contracts separately</li>
                  <li><strong>Unified Template:</strong> Download a template for unified imports</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Export Format</h3>
                <p className="text-sm text-muted-foreground">
                  Data can be exported in different formats:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong>JSON:</strong> Contains all data fields including nested information</li>
                  <li><strong>CSV Templates:</strong> Provide structure for data entry in spreadsheet applications</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Data Backup</h3>
                <p className="text-sm text-muted-foreground">
                  Regular exports are recommended for:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Backup purposes</li>
                  <li>Data analysis in other tools</li>
                  <li>Creating templates for bulk additions</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

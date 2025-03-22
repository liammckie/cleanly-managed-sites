
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertCircle, FileDown, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const ImportExportInstructions: React.FC = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Data must be imported in the correct order: Clients → Sites → Contracts. 
          Make sure references like client_id and site_id match existing records.
        </AlertDescription>
      </Alert>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="clients">
          <AccordionTrigger>Client Import Template Guide</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The client template includes the following fields:
              </p>
              
              <div className="text-sm space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-semibold">Field</div>
                  <div className="font-semibold">Description</div>
                  
                  <div>name*</div>
                  <div>Client company name (required)</div>
                  
                  <div>contact_name*</div>
                  <div>Primary contact person (required)</div>
                  
                  <div>email</div>
                  <div>Contact email address</div>
                  
                  <div>phone</div>
                  <div>Contact phone number</div>
                  
                  <div>address</div>
                  <div>Street address</div>
                  
                  <div>city</div>
                  <div>City</div>
                  
                  <div>state</div>
                  <div>State or province</div>
                  
                  <div>postcode</div>
                  <div>Postal or ZIP code</div>
                  
                  <div>status</div>
                  <div>Client status (active, inactive, pending)</div>
                  
                  <div>notes</div>
                  <div>Additional notes</div>
                  
                  <div>custom_id</div>
                  <div>Your custom identifier</div>
                </div>
                
                <p className="text-xs italic mt-2">* Required fields</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="sites">
          <AccordionTrigger>Site Import Template Guide</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The site template includes the following fields:
              </p>
              
              <div className="text-sm space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-semibold">Field</div>
                  <div className="font-semibold">Description</div>
                  
                  <div>name*</div>
                  <div>Site name (required)</div>
                  
                  <div>address*</div>
                  <div>Site address (required)</div>
                  
                  <div>city*</div>
                  <div>City (required)</div>
                  
                  <div>state*</div>
                  <div>State or province (required)</div>
                  
                  <div>postcode*</div>
                  <div>Postal or ZIP code (required)</div>
                  
                  <div>status</div>
                  <div>Site status (active, inactive, pending)</div>
                  
                  <div>representative*</div>
                  <div>Site representative (required)</div>
                  
                  <div>phone</div>
                  <div>Site contact phone</div>
                  
                  <div>email</div>
                  <div>Site contact email</div>
                  
                  <div>client_id*</div>
                  <div>ID of client this site belongs to (required)</div>
                  
                  <div>custom_id</div>
                  <div>Your custom identifier</div>
                  
                  <div>monthly_cost</div>
                  <div>Monthly cost (numeric)</div>
                  
                  <div>monthly_revenue</div>
                  <div>Monthly revenue (numeric)</div>
                </div>
                
                <p className="text-xs italic mt-2">* Required fields</p>
                
                <div className="mt-3 p-3 bg-amber-50 rounded border border-amber-200">
                  <p className="text-sm font-medium text-amber-800">Important Note</p>
                  <p className="text-xs text-amber-700">
                    Make sure the client_id field references existing clients in the system.
                    You must import clients before importing sites.
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="contracts">
          <AccordionTrigger>Contract Import Template Guide</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The contract template includes the following fields:
              </p>
              
              <div className="text-sm space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-semibold">Field</div>
                  <div className="font-semibold">Description</div>
                  
                  <div>site_id*</div>
                  <div>ID of the site for this contract (required)</div>
                  
                  <div>start_date</div>
                  <div>Contract start date (YYYY-MM-DD format)</div>
                  
                  <div>end_date</div>
                  <div>Contract end date (YYYY-MM-DD format)</div>
                  
                  <div>contract_number</div>
                  <div>Contract reference number</div>
                  
                  <div>renewal_terms</div>
                  <div>Terms for contract renewal</div>
                  
                  <div>termination_period</div>
                  <div>Notice period for termination</div>
                  
                  <div>notes</div>
                  <div>Additional contract notes</div>
                </div>
                
                <p className="text-xs italic mt-2">* Required fields</p>
                
                <div className="mt-3 p-3 bg-amber-50 rounded border border-amber-200">
                  <p className="text-sm font-medium text-amber-800">Important Note</p>
                  <p className="text-xs text-amber-700">
                    Make sure the site_id field references existing sites in the system.
                    You must import sites before importing contracts.
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="process">
          <AccordionTrigger>Import Process Overview</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Follow these steps for a successful import:
              </p>
              
              <ol className="list-decimal pl-5 text-sm space-y-2">
                <li>Download the appropriate template for the data you want to import</li>
                <li>Fill in the template with your data</li>
                <li>Save as CSV or create a JSON file in the matching format</li>
                <li>Upload your file using the import button</li>
                <li>Review the validation results before confirming the import</li>
                <li>Fix any errors and reupload if necessary</li>
              </ol>
              
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Recommended Import Order</p>
                <ol className="list-decimal pl-5 text-xs text-blue-700">
                  <li>Import Clients first</li>
                  <li>Import Sites next (requires client_id references)</li>
                  <li>Import Contracts last (requires site_id references)</li>
                </ol>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

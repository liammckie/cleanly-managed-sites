
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';

export const ImportExportInstructions: React.FC = () => {
  return (
    <Card className="p-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How to Import and Export Data</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <p>
                This page allows you to import and export your data. You can use this feature to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Back up your data</li>
                <li>Transfer data between accounts</li>
                <li>Import data from other systems</li>
                <li>Bulk upload new records</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>CSV Import Format</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <p>
                You can import data using CSV files. Download the templates for each data type to see the required format.
                Make sure your CSV files have the correct headers and data format.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Important Notes:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>For site imports, the client_id must match an existing client in the system</li>
                  <li>For contract imports, the site_id must match an existing site in the system</li>
                  <li>Dates should be in YYYY-MM-DD format (e.g., 2023-01-31)</li>
                  <li>If possible, include the custom_id field to make it easier to match records</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>Data Relationships</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <p>
                When importing data, it's important to understand how the different types of data are related:
              </p>
              
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Clients</strong>: The parent record that sites are linked to</li>
                <li><strong>Sites</strong>: Linked to a specific client via the client_id field</li>
                <li><strong>Contracts</strong>: Linked to a specific site via the site_id field</li>
              </ul>
              
              <p>For best results, import your data in this order:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Import clients first</li>
                <li>Import sites second (using the client_id from the imported clients)</li>
                <li>Import contracts last (using the site_id from the imported sites)</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

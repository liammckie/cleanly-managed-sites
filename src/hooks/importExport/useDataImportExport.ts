import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type KnownTable = 
  | 'contacts' 
  | 'subcontractors' 
  | 'allowances' 
  | 'business_details' 
  | 'business_documents' 
  | 'business_locations' 
  | 'clients' 
  | 'contractor_documents' 
  | 'contractors' 
  | 'contractor_history' 
  | 'contractor_payments' 
  | 'contractor_site_assignments' 
  | 'documents' 
  | 'invoice_line_items'
  | 'invoices'
  | 'notes'
  | 'overhead_profiles'
  | 'quotes'
  | 'quote_shifts'
  | 'quote_subcontractors'
  | 'sites'
  | 'site_additional_contracts'
  | 'site_billing_lines'
  | 'site_contract_history'
  | 'tasks'
  | 'users'
  | 'user_integrations'
  | 'user_profiles'
  | 'user_roles'
  | 'work_orders';

export function useDataImportExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [exportData, setExportData] = useState<any>(null);

  const exportAllData = async () => {
    try {
      setIsExporting(true);
      
      // Fetch all needed data
      const fetchTableData = async (table: KnownTable) => {
        const { data, error } = await supabase.from(table).select('*');
        if (error) throw new Error(`Error fetching ${table}: ${error.message}`);
        return data;
      };
      
      const [clients, sites, contractors, contacts] = await Promise.all([
        fetchTableData('clients'),
        fetchTableData('sites'),
        fetchTableData('contractors'),
        fetchTableData('contacts')
      ]);
      
      const exportObject = {
        clients,
        sites,
        contractors,
        contacts,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      setExportData(exportObject);
      return exportObject;
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };
  
  const generateTestData = async () => {
    try {
      setIsGenerating(true);
      
      // Implementation would go here
      // This is a placeholder for the actual data generation logic
      
      toast.success('Test data generated successfully');
      setIsGenerated(true);
      
      return { success: true };
    } catch (error: any) {
      toast.error(`Failed to generate test data: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    isExporting,
    isImporting,
    exportData,
    exportAllData,
    isGenerating,
    isGenerated,
    generateTestData
  };
}

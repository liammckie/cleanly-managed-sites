
import { supabase } from '@/lib/supabase';
import { ContractorVersionHistoryEntry } from '@/lib/types';

// Functions to manage contractor history
export const contractorHistoryApi = {
  // Get history entries for a contractor
  async getContractorHistory(contractorId: string): Promise<ContractorVersionHistoryEntry[]> {
    const { data, error } = await supabase
      .from('contractor_history')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('version_number', { ascending: false });
    
    if (error) {
      console.error(`Error fetching history for contractor ${contractorId}:`, error);
      throw error;
    }
    
    return data as ContractorVersionHistoryEntry[];
  },
  
  // Get specific history entry
  async getHistoryEntry(historyId: string): Promise<ContractorVersionHistoryEntry | null> {
    const { data, error } = await supabase
      .from('contractor_history')
      .select('*')
      .eq('id', historyId)
      .single();
    
    if (error) {
      console.error(`Error fetching history entry ${historyId}:`, error);
      throw error;
    }
    
    return data as ContractorVersionHistoryEntry;
  }
};

// Document types
export interface ContractorDocument {
  id: string;
  contractor_id: string;
  name: string;
  document_type: string;
  file_path?: string;
  issue_date?: string;
  expiry_date?: string;
  reminder_days?: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Functions to manage contractor documents
export const contractorDocumentsApi = {
  // Get documents for a contractor
  async getContractorDocuments(contractorId: string): Promise<ContractorDocument[]> {
    const { data, error } = await supabase
      .from('contractor_documents')
      .select('*')
      .eq('contractor_id', contractorId);
    
    if (error) {
      console.error(`Error fetching documents for contractor ${contractorId}:`, error);
      throw error;
    }
    
    return data as ContractorDocument[];
  },
  
  // Create a new document
  async createDocument(document: {
    contractor_id: string;
    name: string;
    document_type: string;
    file_path?: string;
    issue_date?: string;
    expiry_date?: string;
    reminder_days?: number;
    notes?: string;
  }): Promise<ContractorDocument> {
    const { data, error } = await supabase
      .from('contractor_documents')
      .insert({
        contractor_id: document.contractor_id,
        name: document.name,
        document_type: document.document_type,
        file_path: document.file_path,
        issue_date: document.issue_date,
        expiry_date: document.expiry_date,
        reminder_days: document.reminder_days,
        notes: document.notes
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error creating document for contractor ${document.contractor_id}:`, error);
      throw error;
    }
    
    return data as ContractorDocument;
  },
  
  // Update an existing document
  async updateDocument(documentId: string, document: {
    name?: string;
    document_type?: string;
    file_path?: string;
    issue_date?: string;
    expiry_date?: string;
    reminder_days?: number;
    notes?: string;
  }): Promise<ContractorDocument> {
    const { data, error } = await supabase
      .from('contractor_documents')
      .update(document)
      .eq('id', documentId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating document ${documentId}:`, error);
      throw error;
    }
    
    return data as ContractorDocument;
  },
  
  // Delete a document
  async deleteDocument(documentId: string): Promise<void> {
    const { error } = await supabase
      .from('contractor_documents')
      .delete()
      .eq('id', documentId);
    
    if (error) {
      console.error(`Error deleting document ${documentId}:`, error);
      throw error;
    }
  }
};

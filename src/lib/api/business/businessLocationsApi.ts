
import { supabase } from '@/integrations/supabase/client';
import { BusinessLocation, BusinessDocument } from '@/components/business/businessLocationSchema';

// Type for the API responses
export type BusinessLocationRecord = {
  id: string;
  name: string;
  type: string;
  address: string;
  city?: string;
  state?: string;
  postcode?: string;
  country: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  opening_hours?: string;
  manager_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  documents?: BusinessDocumentRecord[];
  contacts?: any[];
};

// Type for the document API responses
export type BusinessDocumentRecord = {
  id: string;
  location_id: string;
  name: string;
  type: string;
  file_url?: string;
  issue_date?: string;
  expiry_date?: string;
  reminder_days?: number;
  issuer?: string;
  document_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export const businessLocationsApi = {
  // Fetch all business locations
  async getBusinessLocations(): Promise<BusinessLocationRecord[]> {
    const { data, error } = await supabase
      .from('business_locations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching business locations:', error);
      throw error;
    }
    
    return data as BusinessLocationRecord[] || [];
  },
  
  // Fetch a single business location by ID
  async getBusinessLocationById(id: string): Promise<BusinessLocationRecord | null> {
    const { data: location, error: locationError } = await supabase
      .from('business_locations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (locationError) {
      console.error(`Error fetching business location with ID ${id}:`, locationError);
      throw locationError;
    }
    
    // Fetch documents for this location
    const { data: documents, error: documentsError } = await supabase
      .from('business_documents')
      .select('*')
      .eq('location_id', id);
    
    if (documentsError) {
      console.error(`Error fetching documents for location with ID ${id}:`, documentsError);
      throw documentsError;
    }
    
    return {
      ...location as BusinessLocationRecord,
      documents: documents as BusinessDocumentRecord[] || []
    };
  },
  
  // Create a new business location
  async createBusinessLocation(locationData: Partial<BusinessLocation>): Promise<BusinessLocationRecord> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Ensure required fields are present for database
    if (!locationData.name || !locationData.type || !locationData.address) {
      throw new Error('Name, type, and address are required fields');
    }
    
    const dbLocationData = {
      name: locationData.name,
      type: locationData.type,
      address: locationData.address,
      city: locationData.city,
      state: locationData.state,
      postcode: locationData.postcode,
      country: locationData.country || 'Australia',
      phone: locationData.phone,
      email: locationData.email,
      is_active: locationData.is_active !== undefined ? locationData.is_active : true,
      opening_hours: locationData.opening_hours,
      manager_id: locationData.manager_id,
      notes: locationData.notes,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('business_locations')
      .insert(dbLocationData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating business location:', error);
      throw error;
    }
    
    return data as BusinessLocationRecord;
  },
  
  // Update an existing business location
  async updateBusinessLocation(id: string, locationData: Partial<BusinessLocation>): Promise<BusinessLocationRecord> {
    const { data, error } = await supabase
      .from('business_locations')
      .update(locationData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating business location with ID ${id}:`, error);
      throw error;
    }
    
    return data as BusinessLocationRecord;
  },
  
  // Delete a business location
  async deleteBusinessLocation(id: string): Promise<void> {
    const { error } = await supabase
      .from('business_locations')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting business location with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Document-related operations
  async getBusinessDocuments(locationId: string): Promise<BusinessDocumentRecord[]> {
    const { data, error } = await supabase
      .from('business_documents')
      .select('*')
      .eq('location_id', locationId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching documents for location ${locationId}:`, error);
      throw error;
    }
    
    return data as BusinessDocumentRecord[] || [];
  },
  
  async addBusinessDocument(locationId: string, document: Partial<BusinessDocument>): Promise<BusinessDocumentRecord> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Ensure required fields are present and convert dates to strings
    if (!document.name || !document.type) {
      throw new Error('Document name and type are required');
    }
    
    const dbDocumentData = {
      location_id: locationId,
      name: document.name,
      type: document.type,
      file_url: document.file_url,
      issue_date: document.issue_date ? document.issue_date.toISOString().split('T')[0] : undefined,
      expiry_date: document.expiry_date ? document.expiry_date.toISOString().split('T')[0] : undefined,
      reminder_days: document.reminder_days || 30,
      issuer: document.issuer,
      document_number: document.document_number,
      notes: document.notes,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('business_documents')
      .insert(dbDocumentData)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding business document:', error);
      throw error;
    }
    
    return data as BusinessDocumentRecord;
  },
  
  // Get soon-to-expire documents
  async getExpiringDocuments(daysThreshold: number = 30): Promise<BusinessDocumentRecord[]> {
    // Calculate the date threshold
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    
    const { data, error } = await supabase
      .from('business_documents')
      .select(`
        *,
        business_locations!inner(name)
      `)
      .lt('expiry_date', thresholdDate.toISOString().split('T')[0])
      .gt('expiry_date', new Date().toISOString().split('T')[0])
      .order('expiry_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching expiring documents:', error);
      throw error;
    }
    
    return data as BusinessDocumentRecord[] || [];
  }
};

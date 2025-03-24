
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
  documents?: BusinessDocument[];
  contacts?: any[];
};

// Type for the document API responses
export type BusinessDocumentRecord = BusinessDocument & {
  id: string;
  location_id: string;
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
      documents: documents as BusinessDocument[] || []
    };
  },
  
  // Create a new business location
  async createBusinessLocation(locationData: Partial<BusinessLocation>): Promise<BusinessLocationRecord> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('business_locations')
      .insert({
        ...locationData,
        user_id: user.id
      })
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
  async getBusinessDocuments(locationId: string): Promise<BusinessDocument[]> {
    const { data, error } = await supabase
      .from('business_documents')
      .select('*')
      .eq('location_id', locationId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching documents for location ${locationId}:`, error);
      throw error;
    }
    
    return data as BusinessDocument[] || [];
  },
  
  async addBusinessDocument(locationId: string, document: Partial<BusinessDocument>): Promise<BusinessDocument> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('business_documents')
      .insert({
        ...document,
        location_id: locationId,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding business document:', error);
      throw error;
    }
    
    return data as BusinessDocument;
  },
  
  // Get soon-to-expire documents
  async getExpiringDocuments(daysThreshold: number = 30): Promise<BusinessDocument[]> {
    // Calculate the date threshold
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    
    const { data, error } = await supabase
      .from('business_documents')
      .select(`
        *,
        business_locations!inner(name)
      `)
      .lt('expiry_date', thresholdDate.toISOString())
      .gt('expiry_date', new Date().toISOString())
      .order('expiry_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching expiring documents:', error);
      throw error;
    }
    
    return data as unknown as BusinessDocument[] || [];
  }
};

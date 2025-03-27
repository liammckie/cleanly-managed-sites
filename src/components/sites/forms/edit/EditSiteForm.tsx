
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSite } from '@/hooks/useSite';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { getInitialFormData } from '@/components/sites/forms/types/initialFormData';
import { SiteStatus } from '@/types/common';
import { sitesApi } from '@/lib/api/sites';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function EditSiteForm() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { site, isLoading, error } = useSite(siteId);
  const [formData, setFormData] = useState<SiteFormData>(getInitialFormData());
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (site) {
      // Convert site data to form data format
      const siteFormData: SiteFormData = {
        name: site.name || '',
        address: site.address || '',
        city: site.city || '',
        state: site.state || '',
        postalCode: site.postcode || '',
        country: 'Australia', // Default
        client_id: site.client_id,
        client_name: site.client_name,
        status: site.status as SiteStatus,
        phone: site.phone || '',
        email: site.email || '',
        representative: site.representative || '',
        customId: site.custom_id || '',
        
        // Contract details
        contract_details: site.contract_details || {},
        
        // Contacts initialization
        contacts: site.contacts || [],
        
        // Set default values for required fields
        notes: site.notes || '',
      };
      
      setFormData(siteFormData);
    }
  }, [site]);
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!siteId) return;
    
    try {
      setIsSaving(true);
      
      // Prepare data for API
      const updateData = {
        ...formData,
        postcode: formData.postalCode, // Sync field names
      };
      
      // Send update request
      await sitesApi.updateSite(siteId, updateData);
      
      toast.success('Site updated successfully');
      navigate(`/sites/${siteId}`);
    } catch (err) {
      console.error('Error updating site:', err);
      toast.error('Failed to update site');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Error loading site: {error.message}</p>
        <Button onClick={() => navigate('/sites')} className="mt-4">
          Return to Sites
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Site Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="on-hold">On Hold</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Postal Code</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Site Representative</label>
        <input
          type="text"
          value={formData.representative || ''}
          onChange={(e) => handleChange('representative', e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="w-full px-3 py-2 border rounded min-h-[100px]"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => navigate(`/sites/${siteId}`)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}

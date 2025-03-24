
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { businessLocationsApi, BusinessLocationRecord } from '@/lib/api/business/businessLocationsApi';
import { BusinessLocation, BusinessDocument } from '@/components/business/businessLocationSchema';

export function useBusinessLocations() {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<BusinessLocationRecord | null>(null);

  // Fetch all locations
  const { data: locations, isLoading, error } = useQuery({
    queryKey: ['business-locations'],
    queryFn: businessLocationsApi.getBusinessLocations,
  });

  // Fetch expiring documents
  const { data: expiringDocuments } = useQuery({
    queryKey: ['expiring-documents'],
    queryFn: () => businessLocationsApi.getExpiringDocuments(60), // Documents expiring in the next 60 days
  });

  // Create location mutation
  const createLocationMutation = useMutation({
    mutationFn: (newLocation: Partial<BusinessLocation>) => 
      businessLocationsApi.createBusinessLocation(newLocation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-locations'] });
      toast.success('Business location created successfully');
      setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to create business location: ${error.message}`);
    },
  });

  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BusinessLocation> }) => 
      businessLocationsApi.updateBusinessLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-locations'] });
      toast.success('Business location updated successfully');
      setIsAddDialogOpen(false);
      setEditingLocation(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to update business location: ${error.message}`);
    },
  });

  // Delete location mutation
  const deleteLocationMutation = useMutation({
    mutationFn: (id: string) => 
      businessLocationsApi.deleteBusinessLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-locations'] });
      toast.success('Business location deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete business location: ${error.message}`);
    },
  });

  // Add document mutation
  const addDocumentMutation = useMutation({
    mutationFn: ({ locationId, document }: { locationId: string; document: Partial<BusinessDocument> }) => 
      businessLocationsApi.addBusinessDocument(locationId, document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-locations'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-documents'] });
      toast.success('Document added successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to add document: ${error.message}`);
    },
  });

  // Handlers
  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
    setEditingLocation(null);
  };

  const handleEditLocation = (location: BusinessLocationRecord) => {
    setEditingLocation(location);
    setIsAddDialogOpen(true);
  };

  const handleDeleteLocation = (id: string) => {
    if (confirm('Are you sure you want to delete this business location?')) {
      deleteLocationMutation.mutate(id);
    }
  };

  const handleCreateLocation = (locationData: Partial<BusinessLocation>) => {
    createLocationMutation.mutate(locationData);
  };

  const handleUpdateLocation = (id: string, locationData: Partial<BusinessLocation>) => {
    updateLocationMutation.mutate({ id, data: locationData });
  };

  const handleAddDocument = (locationId: string, document: Partial<BusinessDocument>) => {
    addDocumentMutation.mutate({ locationId, document });
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setEditingLocation(null);
  };

  return {
    locations,
    expiringDocuments,
    isLoading,
    error,
    isAddDialogOpen,
    editingLocation,
    handleOpenAddDialog,
    handleEditLocation,
    handleDeleteLocation,
    handleCreateLocation,
    handleUpdateLocation,
    handleAddDocument,
    closeAddDialog
  };
}


import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  BusinessDetails, 
  getBusinessDetails, 
  updateBusinessDetails, 
  uploadBusinessLogo 
} from '@/lib/api/businessDetails/businessDetailsApi';
import { toast } from 'sonner';

export const useBusinessDetails = () => {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch business details
  const { 
    data: businessDetails, 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['businessDetails'],
    queryFn: getBusinessDetails,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Update business details
  const updateDetailsMutation = useMutation({
    mutationFn: (details: Partial<BusinessDetails>) => updateBusinessDetails(details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessDetails'] });
      toast.success('Business details updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update business details:', error);
      toast.error('Failed to update business details');
    }
  });

  // Upload logo
  const uploadLogo = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      console.log('Uploading logo file:', file.name, file.size);
      
      // Upload the file to Supabase storage
      const logoUrl = await uploadBusinessLogo(file);
      console.log('Logo uploaded, received URL:', logoUrl);
      
      if (logoUrl) {
        // Update business details with the new logo URL
        await updateDetailsMutation.mutateAsync({ logo_url: logoUrl });
        console.log('Business details updated with new logo URL');
        toast.success('Logo uploaded successfully');
        return logoUrl;
      }
    } catch (error) {
      console.error('Failed to upload logo:', error);
      toast.error('Failed to upload logo');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    businessDetails,
    isLoading,
    isUploading,
    error,
    updateBusinessDetails: updateDetailsMutation.mutate,
    uploadLogo,
    refetch
  };
};

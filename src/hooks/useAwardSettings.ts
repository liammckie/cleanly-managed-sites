
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AwardSettings } from '@/lib/award/types';
import { defaultAwardSettings } from '@/lib/award/awardData';
import { toast } from 'sonner';

export function useAwardSettings() {
  const queryClient = useQueryClient();
  
  const { data: settings = defaultAwardSettings, isLoading, error } = useQuery({
    queryKey: ['award-settings'],
    queryFn: async () => {
      try {
        // In a real app, this would fetch from an API
        // For now, retrieve from localStorage or use defaults
        const savedSettings = localStorage.getItem('award-settings');
        return savedSettings ? JSON.parse(savedSettings) : defaultAwardSettings;
      } catch (error) {
        console.error('Error loading award settings:', error);
        toast.error('Failed to load award settings, using defaults');
        return defaultAwardSettings;
      }
    }
  });
  
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: AwardSettings) => {
      try {
        // In a real app, this would be an API call
        // For now, save to localStorage
        const settingsToSave = {
          ...newSettings,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('award-settings', JSON.stringify(settingsToSave));
        return settingsToSave;
      } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['award-settings'] });
      toast.success('Award settings updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating settings: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  
  const resetSettingsMutation = useMutation({
    mutationFn: async () => {
      try {
        // In a real app, this would be an API call
        // For now, reset to defaults in localStorage
        const resetSettings = {
          ...defaultAwardSettings,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('award-settings', JSON.stringify(resetSettings));
        return resetSettings;
      } catch (error) {
        console.error('Error resetting settings:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['award-settings'] });
      toast.success('Award settings reset to defaults');
    },
    onError: (error) => {
      toast.error(`Error resetting settings: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  
  return {
    settings,
    isLoading,
    error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
    resetSettings: resetSettingsMutation.mutate,
    isResetting: resetSettingsMutation.isPending
  };
}

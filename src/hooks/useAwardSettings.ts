
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AwardSettings } from '@/lib/award/types';
import { defaultAwardSettings } from '@/lib/award/awardData';
import { toast } from 'sonner';

export function useAwardSettings() {
  const [settings, setSettings] = useState<AwardSettings>({
    baseRateMultiplier: 1.0,
    overheadPercentageDefault: 15,
    marginPercentageDefault: 20,
    lastUpdated: new Date().toISOString()
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // First try to load from local storage
      const storedSettings = localStorage.getItem('awardSettings');
      
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        // If not in local storage, use default settings
        setSettings({
          ...defaultAwardSettings,
          baseRateMultiplier: 1.0,
          overheadPercentageDefault: defaultAwardSettings.overheadPercentageDefault,
          marginPercentageDefault: defaultAwardSettings.marginPercentageDefault,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error loading award settings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateSettings = async (newSettings: AwardSettings) => {
    try {
      // Update the lastUpdated field
      const updatedSettings = {
        ...newSettings,
        lastUpdated: new Date().toISOString()
      };
      
      // Save to local storage
      localStorage.setItem('awardSettings', JSON.stringify(updatedSettings));
      
      // Update state
      setSettings(updatedSettings);
      
      toast.success('Award settings updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating award settings:', error);
      toast.error('Failed to update award settings');
      return false;
    }
  };
  
  const resetSettings = async () => {
    const defaultValues = {
      baseRateMultiplier: 1.0,
      overheadPercentageDefault: defaultAwardSettings.overheadPercentageDefault,
      marginPercentageDefault: defaultAwardSettings.marginPercentageDefault,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('awardSettings', JSON.stringify(defaultValues));
    setSettings(defaultValues);
    toast.success('Award settings reset to defaults');
    return true;
  };
  
  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings
  };
}

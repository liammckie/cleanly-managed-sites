
import { useState, useEffect } from 'react';
import { AwardSettings } from '@/lib/award/types';
import { defaultAwardSettings } from '@/lib/award/awardData';
import { recalculateRatesWithMultiplier } from '@/lib/award/awardEngine';
import { toast } from 'sonner';

const AWARD_SETTINGS_KEY = 'award_settings';

export function useAwardSettings() {
  const [settings, setSettings] = useState<AwardSettings>(defaultAwardSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from local storage
  useEffect(() => {
    const loadSettings = () => {
      setIsLoading(true);
      try {
        const savedSettings = localStorage.getItem(AWARD_SETTINGS_KEY);
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
        }
      } catch (error) {
        console.error('Error loading award settings:', error);
        toast.error('Failed to load award settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to local storage
  const updateSettings = (newSettings: Partial<AwardSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings, lastUpdated: new Date().toISOString() };
      setSettings(updatedSettings);
      localStorage.setItem(AWARD_SETTINGS_KEY, JSON.stringify(updatedSettings));
      
      // If the multiplier changed, recalculate all rates
      if (newSettings.baseRateMultiplier && newSettings.baseRateMultiplier !== settings.baseRateMultiplier) {
        recalculateRatesWithMultiplier(newSettings.baseRateMultiplier);
      }
      
      toast.success('Award settings updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating award settings:', error);
      toast.error('Failed to update award settings');
      return false;
    }
  };

  // Reset settings to default
  const resetSettings = () => {
    try {
      setSettings(defaultAwardSettings);
      localStorage.setItem(AWARD_SETTINGS_KEY, JSON.stringify(defaultAwardSettings));
      toast.success('Award settings reset to default');
      return true;
    } catch (error) {
      console.error('Error resetting award settings:', error);
      toast.error('Failed to reset award settings');
      return false;
    }
  };

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings
  };
}

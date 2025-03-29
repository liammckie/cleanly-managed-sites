
import { useState, useEffect } from 'react';
import { defaultAwardSettings } from '@/lib/award/awardData';

export function useAwardSettings() {
  const [settings, setSettings] = useState(defaultAwardSettings);
  const [isLoading, setIsLoading] = useState(false);

  // Load settings from storage or API
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Here we would typically load from API or localStorage
        // For now, using the default settings
        setSettings(defaultAwardSettings);
      } catch (error) {
        console.error('Error loading award settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: any) => {
    setIsLoading(true);
    try {
      // Here we would typically save to API or localStorage
      setSettings({ ...settings, ...newSettings });
      return true;
    } catch (error) {
      console.error('Error updating award settings:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings,
    updateSettings,
    isLoading
  };
}

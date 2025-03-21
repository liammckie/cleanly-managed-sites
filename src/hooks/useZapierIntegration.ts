
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface ZapierWebhook {
  id: string;
  name: string;
  url: string;
  event_type: string;
  created_at: string;
}

export function useZapierIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const [webhooks, setWebhooks] = useState<ZapierWebhook[]>([]);

  // Save a new webhook
  const saveWebhook = async (name: string, url: string, eventType: string) => {
    if (!url || !name || !eventType) {
      toast.error("Please provide all webhook details");
      return false;
    }

    setIsLoading(true);
    
    try {
      // Store the webhook URL in localStorage for now
      // In a production app, this would be stored in your database
      const newWebhook: ZapierWebhook = {
        id: crypto.randomUUID(),
        name,
        url,
        event_type: eventType,
        created_at: new Date().toISOString()
      };
      
      // Save to local storage
      const existingWebhooks = JSON.parse(localStorage.getItem('zapierWebhooks') || '[]');
      const updatedWebhooks = [...existingWebhooks, newWebhook];
      localStorage.setItem('zapierWebhooks', JSON.stringify(updatedWebhooks));
      
      setWebhooks(updatedWebhooks);
      
      toast.success("Zapier webhook saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving webhook:", error);
      toast.error("Failed to save webhook");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a webhook
  const deleteWebhook = async (id: string) => {
    setIsLoading(true);
    
    try {
      const existingWebhooks = JSON.parse(localStorage.getItem('zapierWebhooks') || '[]');
      const updatedWebhooks = existingWebhooks.filter((hook: ZapierWebhook) => hook.id !== id);
      localStorage.setItem('zapierWebhooks', JSON.stringify(updatedWebhooks));
      
      setWebhooks(updatedWebhooks);
      
      toast.success("Webhook deleted successfully");
    } catch (error) {
      console.error("Error deleting webhook:", error);
      toast.error("Failed to delete webhook");
    } finally {
      setIsLoading(false);
    }
  };

  // Load stored webhooks
  const loadWebhooks = () => {
    try {
      const storedWebhooks = JSON.parse(localStorage.getItem('zapierWebhooks') || '[]');
      setWebhooks(storedWebhooks);
    } catch (error) {
      console.error("Error loading webhooks:", error);
      toast.error("Failed to load webhooks");
    }
  };

  // Trigger a webhook
  const triggerWebhook = async (webhookUrl: string, data: any) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Handle CORS issues
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
        }),
      });
      
      // Since we're using no-cors, we won't get a proper response status
      toast.success("Request sent to Zapier");
      return true;
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast.error("Failed to trigger Zapier webhook");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger a specific event type
  const triggerEvent = async (eventType: string, data: any) => {
    try {
      const storedWebhooks = JSON.parse(localStorage.getItem('zapierWebhooks') || '[]');
      const matchingWebhooks = storedWebhooks.filter(
        (hook: ZapierWebhook) => hook.event_type === eventType
      );
      
      if (matchingWebhooks.length === 0) {
        console.log(`No webhooks found for event type: ${eventType}`);
        return false;
      }
      
      const triggerResults = await Promise.all(
        matchingWebhooks.map((hook: ZapierWebhook) => 
          triggerWebhook(hook.url, data)
        )
      );
      
      return triggerResults.some(result => result === true);
    } catch (error) {
      console.error("Error triggering event:", error);
      return false;
    }
  };

  return {
    webhooks,
    isLoading,
    saveWebhook,
    deleteWebhook,
    loadWebhooks,
    triggerWebhook,
    triggerEvent
  };
}

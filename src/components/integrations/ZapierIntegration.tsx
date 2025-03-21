
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, RefreshCw, ExternalLink } from 'lucide-react';
import { useZapierIntegration, ZapierWebhook } from '@/hooks/useZapierIntegration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ZapierIntegration() {
  const [name, setName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [eventType, setEventType] = useState('site.created');
  const [testData, setTestData] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const {
    webhooks,
    isLoading,
    saveWebhook,
    deleteWebhook,
    loadWebhooks,
    triggerWebhook
  } = useZapierIntegration();

  useEffect(() => {
    loadWebhooks();
  }, []);

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveWebhook(name, webhookUrl, eventType);
    if (success) {
      setName('');
      setWebhookUrl('');
      setIsCreating(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      await deleteWebhook(id);
    }
  };

  const handleTestWebhook = async (url: string) => {
    const testPayload = testData ? JSON.parse(testData) : { test: true };
    triggerWebhook(url, testPayload);
  };

  const handleNewWebhook = () => {
    setIsCreating(true);
  };

  const eventTypeOptions = [
    { value: 'site.created', label: 'Site Created' },
    { value: 'site.updated', label: 'Site Updated' },
    { value: 'client.created', label: 'Client Created' },
    { value: 'client.updated', label: 'Client Updated' },
    { value: 'cleaning.scheduled', label: 'Cleaning Scheduled' },
    { value: 'cleaning.completed', label: 'Cleaning Completed' },
    { value: 'invoice.generated', label: 'Invoice Generated' },
    { value: 'payment.received', label: 'Payment Received' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Zapier Integration</CardTitle>
          <CardDescription>
            Connect your cleaning management system with other apps using Zapier webhooks
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Your Webhooks</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNewWebhook}
                disabled={isCreating}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </div>
            
            {isCreating && (
              <Card className="border-dashed border-primary/50 bg-primary/5 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">New Webhook</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveWebhook} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="webhook-name">Webhook Name</Label>
                      <Input
                        id="webhook-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., New Site Created Notification"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Copy this from your Zapier webhook trigger
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="event-type">Event Type</Label>
                      <Select
                        value={eventType}
                        onValueChange={(value) => setEventType(value)}
                      >
                        <SelectTrigger id="event-type">
                          <SelectValue placeholder="Select an event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreating(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Webhook'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {webhooks.length === 0 && !isCreating ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No webhooks configured yet. Add one to start automating with Zapier.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook: ZapierWebhook) => (
                  <Card key={webhook.id} className="bg-card shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{webhook.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWebhook(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="line-clamp-1 text-xs">
                        URL: {webhook.url}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center text-sm">
                        <span className="font-medium mr-2">Event:</span>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                          {eventTypeOptions.find(opt => opt.value === webhook.event_type)?.label || webhook.event_type}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleTestWebhook(webhook.url)}
                        disabled={isLoading}
                      >
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Test Webhook
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex-col items-start border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Test Webhook Data (Optional)</h4>
          <div className="w-full">
            <textarea
              className="w-full p-2 rounded-md border border-input bg-background resize-y min-h-[100px]"
              placeholder='{"key": "value", "example": "data"}'
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter JSON data to send when testing webhooks. Leave empty to use default test data.
            </p>
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">How to use Zapier with your cleaning management system</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Step 1: Create a Zap in Zapier</h3>
              <p className="text-sm text-muted-foreground">
                Sign in to your Zapier account and create a new Zap. Choose "Webhook" as your trigger app and select "Catch Hook" as the trigger event.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium">Step 2: Copy the webhook URL</h3>
              <p className="text-sm text-muted-foreground">
                Zapier will generate a custom webhook URL. Copy this URL to use in the next step.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium">Step 3: Add the webhook to your cleaning management system</h3>
              <p className="text-sm text-muted-foreground">
                Return to this page and add a new webhook using the URL from Zapier and select the event you want to trigger the Zap.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium">Step 4: Test the connection</h3>
              <p className="text-sm text-muted-foreground">
                Use the "Test Webhook" button to send test data to Zapier and confirm the connection is working.
              </p>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" className="text-primary" onClick={() => window.open('https://zapier.com', '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to Zapier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

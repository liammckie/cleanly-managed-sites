
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

export const GoogleDriveIntegration = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_integrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'google_drive')
          .single();
        
        if (error) {
          console.error('Error checking Google Drive connection:', error);
          return;
        }
        
        setIsConnected(!!data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();
  }, [user]);

  const handleConnect = () => {
    // Get redirect URI from window location
    const redirectUri = `${window.location.origin}/integrations?tab=google-drive`;
    
    // Construct the Google OAuth URL
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    const scope = 'https://www.googleapis.com/auth/drive.file';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
    
    // Redirect to Google OAuth
    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      if (!user) return;
      
      // Call Supabase edge function to revoke the token
      const { error } = await supabase.functions.invoke('google-drive-disconnect', {
        body: { userId: user.id }
      });
      
      if (error) {
        console.error('Error disconnecting from Google Drive:', error);
        toast.error('Failed to disconnect from Google Drive');
        return;
      }
      
      setIsConnected(false);
      toast.success('Successfully disconnected from Google Drive');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while disconnecting');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Handle OAuth callback
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const tab = urlParams.get('tab');
      
      // Only proceed if we're on the Google Drive tab and have a code
      if (tab !== 'google-drive' || !code || error || !user) return;
      
      setIsLoading(true);
      
      try {
        // Get redirect URI from window location
        const redirectUri = `${window.location.origin}/integrations?tab=google-drive`;
        
        // Call Supabase edge function to exchange code for tokens
        const { data, error } = await supabase.functions.invoke('google-drive-auth', {
          body: { 
            code,
            redirectUri,
            userId: user.id
          }
        });
        
        if (error) {
          console.error('Error connecting to Google Drive:', error);
          toast.error('Failed to connect to Google Drive');
          return;
        }
        
        setIsConnected(true);
        toast.success('Successfully connected to Google Drive');
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, '/integrations?tab=google-drive');
      } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred while connecting');
      } finally {
        setIsLoading(false);
      }
    };
    
    handleOAuthCallback();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive Integration</CardTitle>
        <CardDescription>
          Connect to Google Drive to back up and sync your important files.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected to Google Drive' : 'Not connected'}
                </p>
              </div>
              <div>
                {isConnected ? (
                  <Button variant="outline" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                ) : (
                  <Button onClick={handleConnect}>
                    Connect
                  </Button>
                )}
              </div>
            </div>
            
            {isConnected && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">What you can do with Google Drive</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Access and manage files from your Google Drive account</li>
                  <li>Upload site documents and client files to Google Drive</li>
                  <li>Automatically back up important data</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-xs text-muted-foreground">
          This integration uses OAuth 2.0 to securely connect to your Google Drive account.
        </div>
      </CardFooter>
    </Card>
  );
};

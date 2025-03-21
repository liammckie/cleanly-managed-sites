
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Define the interface for a user integration record
interface UserIntegration {
  id: string;
  user_id: string;
  provider: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export const GoogleDriveIntegration = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Use a raw query to check for Google Drive integration
        const { data, error } = await supabase
          .from('user_integrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'google_drive')
          .maybeSingle();
        
        if (error) {
          console.error('Error checking Google Drive connection:', error);
          setError('Failed to check Google Drive connection status');
          return;
        }
        
        setIsConnected(!!data);
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();
  }, [user]);

  const handleConnect = () => {
    if (!user) {
      toast.error('You must be logged in to connect to Google Drive');
      return;
    }
    
    try {
      setError(null);
      
      // Get current origin for the redirect URI
      const origin = window.location.origin;
      // Ensure the redirect path exactly matches what's in the Google Cloud Console
      const redirectUri = `${origin}/integrations?tab=google-drive`;
      
      // Construct the Google OAuth URL
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
      if (!googleClientId) {
        setError('Google Client ID is not configured');
        toast.error('Google Drive integration is not properly configured');
        return;
      }
      
      // Include the drive.file scope for file access
      const scope = 'https://www.googleapis.com/auth/drive.file';
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
      
      console.log('Redirecting to Google OAuth with redirect URI:', redirectUri);
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating Google OAuth:', error);
      setError('Failed to start Google authentication');
      toast.error('Failed to connect to Google Drive');
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        toast.error('You must be logged in to disconnect from Google Drive');
        return;
      }
      
      // Call Supabase edge function to revoke the token
      const { error: functionError } = await supabase.functions.invoke('google-drive-disconnect', {
        body: { userId: user.id }
      });
      
      if (functionError) {
        console.error('Error disconnecting from Google Drive:', functionError);
        setError('Failed to disconnect from Google Drive');
        toast.error('Failed to disconnect from Google Drive');
        return;
      }
      
      setIsConnected(false);
      toast.success('Successfully disconnected from Google Drive');
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
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
      setError(null);
      
      try {
        // Get current origin for the redirect URI - must match exactly what was used in the initial request
        const origin = window.location.origin;
        const redirectUri = `${origin}/integrations?tab=google-drive`;
        
        console.log('Processing OAuth callback with redirect URI:', redirectUri);
        
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
          setError(`Failed to connect to Google Drive: ${error.message || 'Unknown error'}`);
          toast.error('Failed to connect to Google Drive');
          return;
        }
        
        if (data && data.error) {
          console.error('Google Drive connection error:', data.error, data.details);
          setError(`Failed to connect: ${data.error_description || data.details || data.error}`);
          toast.error(`Failed to connect: ${data.error_description || data.details || data.error}`);
          return;
        }
        
        setIsConnected(true);
        toast.success('Successfully connected to Google Drive');
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, '/integrations?tab=google-drive');
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred during authentication');
        toast.error('An error occurred while connecting');
      } finally {
        setIsLoading(false);
      }
    };
    
    handleOAuthCallback();
  }, [user]);

  const renderSetupInstructions = () => {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Google Drive Integration Setup</AlertTitle>
        <AlertDescription className="space-y-4 mt-2">
          <p>To use Google Drive integration, you need to set up OAuth 2.0 credentials:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Go to the <a href="https://console.cloud.google.com/apis/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-medium flex items-center">Google Cloud Console <ExternalLink className="ml-1 h-3 w-3" /></a></li>
            <li>Create a new project or select an existing one</li>
            <li>Enable the Google Drive API for your project</li>
            <li>Configure OAuth consent screen (External type is fine for testing)</li>
            <li>Create OAuth 2.0 credentials (Web application type)</li>
            <li>Add authorized JavaScript origins: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">{window.location.origin}</code></li>
            <li>Add authorized redirect URI: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">{window.location.origin}/integrations?tab=google-drive</code></li>
            <li>Copy the Client ID and set it as <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">VITE_GOOGLE_CLIENT_ID</code> in your .env file</li>
            <li>Copy the Client Secret and set it as <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">GOOGLE_CLIENT_SECRET</code> in your Supabase Edge Function secrets</li>
          </ol>
          <p className="text-sm mt-2">After completing these steps, restart your application and try connecting again.</p>
        </AlertDescription>
      </Alert>
    );
  };

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
            <LoadingSpinner size="md" />
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
                  <Button variant="outline" onClick={handleDisconnect} disabled={isLoading}>
                    Disconnect
                  </Button>
                ) : (
                  <Button onClick={handleConnect} disabled={isLoading}>
                    Connect
                  </Button>
                )}
              </div>
            </div>
            
            {error && (
              <div className="p-3 border border-destructive/30 bg-destructive/10 rounded-md text-sm text-destructive">
                <strong>Error:</strong> {error}
                {(error === 'Google Client ID is not configured') && renderSetupInstructions()}
              </div>
            )}
            
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

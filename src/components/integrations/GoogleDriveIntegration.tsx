import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    setCurrentUrl(window.location.origin);
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
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
      
      const redirectUri = `${window.location.origin}/api/auth/callback/google`;
      
      console.log('Using redirect URI:', redirectUri);
      
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
      if (!googleClientId) {
        setError('Google Client ID is not configured');
        toast.error('Google Drive integration is not properly configured');
        return;
      }
      
      const scope = 'https://www.googleapis.com/auth/drive.file';
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
      
      console.log('Redirecting to Google OAuth with redirect URI:', redirectUri);
      
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
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      if (!code || error || !user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const origin = window.location.origin;
        const redirectUri = `${origin}/api/auth/callback/google`;
        
        console.log('Processing OAuth callback with redirect URI:', redirectUri);
        
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

  const isDevelopmentEnvironment = () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  };

  const isLovablePreviewEnvironment = () => {
    return window.location.hostname.includes('lovableproject.com');
  };

  const renderSetupInstructions = () => {
    const callbackUrl = `${window.location.origin}/api/auth/callback/google`;
    const alternateCallbackUrl = `${window.location.origin}/integrations?tab=google-drive`;
    
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Google Drive Integration Setup</AlertTitle>
        <AlertDescription className="space-y-4 mt-2">
          <p>To use Google Drive integration in this environment, you need to configure your Google OAuth 2.0 credentials:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline font-medium flex items-center">Google Cloud Console Credentials Page <ExternalLink className="ml-1 h-3 w-3" /></a></li>
            <li>Find and edit your OAuth 2.0 Client ID</li>
            <li>For Authorized JavaScript origins: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">{window.location.origin}</code></li>
            <li>For Authorized redirect URIs: Add <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">{callbackUrl}</code></li>
            <li>Alternatively, you can modify the code to use <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">{alternateCallbackUrl}</code> as the redirect URI</li>
            <li>Set your Google Client ID as <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">VITE_GOOGLE_CLIENT_ID</code> in your .env file</li>
            <li>Set your Google Client Secret as <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">GOOGLE_CLIENT_SECRET</code> in your Supabase Edge Function secrets</li>
          </ol>
          
          {isLovablePreviewEnvironment() && (
            <div className="mt-4 p-3 border border-yellow-500/50 bg-yellow-500/10 rounded-md">
              <p className="font-medium">Note for Lovable Preview Environment:</p>
              <p>You're currently in the Lovable app builder preview environment. For OAuth to work here, you must add <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">{window.location.origin}</code> to your Google OAuth authorized origins and <code className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">{callbackUrl}</code> to your authorized redirect URIs.</p>
            </div>
          )}
          
          <p className="text-sm mt-2">After completing these steps, refresh the page and try connecting again.</p>
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
            
            {currentUrl && !error && !isConnected && (
              <div className="p-3 border border-blue-500/30 bg-blue-500/10 rounded-md text-sm">
                <strong>Environment Info:</strong> You are currently running at <code>{currentUrl}</code>
                <p className="mt-2">Make sure this URL is added to your Google OAuth 2.0 credentials as an authorized JavaScript origin, and <code>{`${currentUrl}/api/auth/callback/google`}</code> is added as an authorized redirect URI.</p>
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

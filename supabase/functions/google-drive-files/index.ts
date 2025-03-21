
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, workOrderId, fileInfo, fileId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing user ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with the service role key for admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user's Google Drive integration details
    const { data: integration, error: fetchError } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google_drive')
      .single();

    if (fetchError || !integration) {
      return new Response(
        JSON.stringify({ error: 'Google Drive integration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Google Drive API client wrapper
    const googleDriveApi = {
      async refreshTokenIfNeeded() {
        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(integration.expires_at);
        
        if (now >= expiresAt) {
          console.log('Access token expired, refreshing...');
          
          const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID');
          const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
          
          if (!googleClientId || !googleClientSecret) {
            throw new Error('Missing Google API credentials');
          }
          
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: googleClientId,
              client_secret: googleClientSecret,
              refresh_token: integration.refresh_token,
              grant_type: 'refresh_token',
            }),
          });
          
          const data = await response.json();
          
          if (data.error) {
            throw new Error(`Token refresh failed: ${data.error}`);
          }
          
          // Update the token in the database
          const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();
          
          const { error } = await supabase
            .from('user_integrations')
            .update({
              access_token: data.access_token,
              expires_at: expiresAt,
              updated_at: new Date().toISOString(),
            })
            .eq('id', integration.id);
          
          if (error) {
            throw new Error(`Failed to update token: ${error.message}`);
          }
          
          // Update local integration object
          integration.access_token = data.access_token;
          integration.expires_at = expiresAt;
        }
        
        return integration.access_token;
      },
      
      async createWorkOrderFolder(workOrderId: string, workOrderTitle: string) {
        const accessToken = await this.refreshTokenIfNeeded();
        
        // Create a folder for the work order in Google Drive
        const response = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `Work Order: ${workOrderTitle} (${workOrderId})`,
            mimeType: 'application/vnd.google-apps.folder',
          }),
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(`Failed to create folder: ${data.error.message}`);
        }
        
        return data.id;
      },
      
      async getUploadUrl(folderId: string, fileName: string, mimeType: string) {
        const accessToken = await this.refreshTokenIfNeeded();
        
        // Create a file entry in Google Drive
        const response = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: fileName,
            parents: [folderId],
          }),
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(`Failed to create file entry: ${data.error.message}`);
        }
        
        // Generate a resumable upload URL
        const uploadUrlResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${data.id}?uploadType=resumable`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Upload-Content-Type': mimeType,
          },
          body: JSON.stringify({}),
        });
        
        if (!uploadUrlResponse.ok) {
          throw new Error(`Failed to get upload URL: ${uploadUrlResponse.statusText}`);
        }
        
        const uploadUrl = uploadUrlResponse.headers.get('Location');
        
        if (!uploadUrl) {
          throw new Error('No upload URL returned');
        }
        
        return {
          fileId: data.id,
          uploadUrl,
        };
      },
      
      async getDownloadUrl(fileId: string) {
        const accessToken = await this.refreshTokenIfNeeded();
        
        // Get file metadata to confirm existence
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(`Failed to get file: ${data.error.message}`);
        }
        
        // For Google native docs, we need to export them in a specific format
        if (data.mimeType.includes('google-apps')) {
          let exportMimeType = 'application/pdf';
          if (data.mimeType === 'application/vnd.google-apps.spreadsheet') {
            exportMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          } else if (data.mimeType === 'application/vnd.google-apps.document') {
            exportMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          }
          
          return `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(exportMimeType)}&alt=media`;
        }
        
        // For regular files
        return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      },
      
      async deleteFile(fileId: string) {
        const accessToken = await this.refreshTokenIfNeeded();
        
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to delete file: ${errorData.error.message}`);
        }
        
        return true;
      }
    };

    // Perform the requested action
    let result;
    
    switch (action) {
      case 'create_folder':
        if (!workOrderId || !fileInfo?.title) {
          return new Response(
            JSON.stringify({ error: 'Missing required parameters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        result = await googleDriveApi.createWorkOrderFolder(workOrderId, fileInfo.title);
        break;
        
      case 'get_upload_url':
        if (!fileInfo?.folderId || !fileInfo?.fileName || !fileInfo?.mimeType) {
          return new Response(
            JSON.stringify({ error: 'Missing required parameters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        result = await googleDriveApi.getUploadUrl(fileInfo.folderId, fileInfo.fileName, fileInfo.mimeType);
        break;
        
      case 'get_download_url':
        if (!fileId) {
          return new Response(
            JSON.stringify({ error: 'Missing file ID' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        result = await googleDriveApi.getDownloadUrl(fileId);
        break;
        
      case 'delete_file':
        if (!fileId) {
          return new Response(
            JSON.stringify({ error: 'Missing file ID' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        result = await googleDriveApi.deleteFile(fileId);
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

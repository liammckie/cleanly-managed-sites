
-- Add new columns to the business_details table if they don't exist
ALTER TABLE business_details 
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS business_hours TEXT,
ADD COLUMN IF NOT EXISTS social_media JSONB;

-- Create the business-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('business-assets', 'business-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow authenticated users to upload files
CREATE POLICY IF NOT EXISTS "Allow users to upload their own logos" 
ON storage.objects FOR INSERT TO authenticated
USING (bucket_id = 'business-assets' AND (storage.foldername(name))[1] = 'business-logos');

-- Create a policy to allow users to update their own files
CREATE POLICY IF NOT EXISTS "Allow users to update their own logos" 
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'business-assets' AND (storage.foldername(name))[1] = 'business-logos');

-- Create a policy to allow public read access
CREATE POLICY IF NOT EXISTS "Allow public to view business logos" 
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'business-assets');

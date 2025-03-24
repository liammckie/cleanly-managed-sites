// Re-export the supabase client from the integrations folder
// This ensures we only have one instance of the client throughout the app
import { supabase } from '@/integrations/supabase/client';

export { supabase };

// Define the Json type which is used in Supabase projects
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

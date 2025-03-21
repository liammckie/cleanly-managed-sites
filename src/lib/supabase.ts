
// Re-export the supabase client from the integrations folder
// This ensures we only have one instance of the client throughout the app
import { supabase } from '@/integrations/supabase/client';

export { supabase };

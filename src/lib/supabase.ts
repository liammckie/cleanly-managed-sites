
import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase URL and anon key
const supabaseUrl = 'https://lchmrratcvszwnaugeaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaG1ycmF0Y3ZzenduYXVnZWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjExOTQsImV4cCI6MjA1ODEzNzE5NH0.p6jGj3FHzeWhW70olZUK7ZezVHqYGfzrImrObfTljqI';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

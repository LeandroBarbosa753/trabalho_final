import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = "https://pqimslfmeguvpzhsyslq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxaW1zbGZtZWd1dnB6aHN5c2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMDE5NTcsImV4cCI6MjA2OTU3Nzk1N30.eQPJ4V8OHcx6k_7g_9en17FZMoxJeHLJeCYtFJUppnI";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key must be provided in app.json under extra.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

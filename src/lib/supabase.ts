import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = "https://ronyazdmazhsmhlwmxas.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvbnlhemRtYXpoc21obHdteGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNDU4ODEsImV4cCI6MjA0ODYyMTg4MX0.KLCmbaZewUtVZpn4UvIPN9LtiQOZ_0hKSfQ9nCHW43o";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
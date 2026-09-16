import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vqnsoxxudtvdszmgnwyq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbnNveHh1ZHR2ZHN6bWdud3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NTkwODksImV4cCI6MjEwNTEzNTA4OX0.HKt7tez5lnIMR72xVQowur_7eTktO7hSymBUYl_Wkgw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

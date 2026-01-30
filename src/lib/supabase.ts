import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client for frontend use (with anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for backend use (with service role key - bypasses RLS)
// Only available on server-side
let _supabaseAdmin: SupabaseClient | null = null;

export const getSupabaseAdmin = (): SupabaseClient => {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin should only be used on the server');
  }
  if (!_supabaseAdmin) {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }
  return _supabaseAdmin;
};

// For backward compatibility in API routes
export const supabaseAdmin = typeof window === 'undefined' 
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  : null as unknown as SupabaseClient;

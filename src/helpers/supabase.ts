import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export const supabaseAdmin =
  typeof window === 'undefined'
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '')
    : (null as unknown as SupabaseClient);

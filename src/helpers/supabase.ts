import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;
let supabaseAdmin: SupabaseClient | null = null;

const env = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};

export const getSupabase = () =>
  (supabase ??= createClient(
    env('NEXT_PUBLIC_SUPABASE_URL'),
    env('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  ));

export const getSupabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseAdmin should only be used on the server');
  }

  return (supabaseAdmin ??= createClient(
    env('NEXT_PUBLIC_SUPABASE_URL'),
    env('SUPABASE_SERVICE_ROLE_KEY'),
  ));
};

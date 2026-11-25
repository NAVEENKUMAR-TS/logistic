import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mjvuaxppjynytpkhbiox.supabase.co';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_kA6eAqXTMhD_7lgqCrQ2bg_gv0crtmd';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase Client] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Please verify your .env configuration.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

export default supabase;


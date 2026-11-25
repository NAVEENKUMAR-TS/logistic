import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://mjvuaxppjynytpkhbiox.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_kA6eAqXTMhD_7lgqCrQ2bg_gv0crtmd';

console.log('[Setup] Connecting to Supabase at:', supabaseUrl);
console.log('[Setup] Key length:', supabaseKey.length);

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const email = 'abc@gmail.com';
  const password = '12345678';

  console.log(`[Setup] Attempting signUp for ${email}...`);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: 'Dev Tester',
        role: 'admin',
      },
    },
  });

  if (signUpError) {
    console.log('[SignUp] Result error:', signUpError.message);
  } else {
    console.log('[SignUp] User ID:', signUpData.user?.id);
    console.log('[SignUp] Email confirmed at:', signUpData.user?.email_confirmed_at);
  }

  // Test sign in with password
  console.log(`[Setup] Testing signInWithPassword for ${email}...`);
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.log('[SignIn] Result error:', signInError.message);
  } else {
    console.log('[SignIn] Success! Session user:', signInData.user?.email);
    console.log('[SignIn] User metadata role:', signInData.user?.user_metadata?.role);
    console.log('[SignIn] Access token preview:', signInData.session?.access_token.substring(0, 30) + '...');
  }
}

main().catch(console.error);


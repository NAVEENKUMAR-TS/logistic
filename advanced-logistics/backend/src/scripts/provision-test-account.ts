import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminAuthService } from '../services/adminAuth.service.js';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://mjvuaxppjynytpkhbiox.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_kA6eAqXTMhD_7lgqCrQ2bg_gv0crtmd';

  console.log('=================================================================');
  console.log('  AILMS Development Test Account Provisioning (Supabase Admin)   ');
  console.log('=================================================================');
  console.log(`Supabase URL: ${supabaseUrl}`);

  if (!serviceRoleKey) {
    console.error('\n[MISSING SERVICE ROLE KEY]');
    console.error('To create and confirm abc@gmail.com via the Supabase Admin API:');
    console.error('1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/mjvuaxppjynytpkhbiox/settings/api');
    console.error('2. Under "Secret keys", copy the key starting with "sb_secret_..."');
    console.error('3. Add the following line to your .env file:');
    console.error('   SUPABASE_SERVICE_ROLE_KEY=sb_secret_your_copied_secret_key');
    console.error('4. Re-run: npm run dev:provision\n');
    process.exit(1);
  }

  console.log('\n[1/3] Provisioning user admin.ailms@gmail.com via Supabase Admin API...');
  const result = await adminAuthService.provisionTestAccount(
    'admin.ailms@gmail.com',
    '12345678',
    serviceRoleKey
  );

  if (!result.success) {
    console.error('\n[ERROR] Provisioning failed:', result.message);
    process.exit(1);
  }

  console.log('[SUCCESS]', result.message);
  console.log(`User ID: ${result.user?.id}`);
  console.log(`Email Confirmed: ${result.user?.emailConfirmed}`);
  console.log(`Role: ${result.user?.role}`);
  console.log(`Prisma Sync: ${result.prismaSynced ? 'Synchronized' : 'Skipped/Pending'}`);

  console.log('\n[2/3] Verifying authentication with signInWithPassword()...');
  const publicClient = createClient(supabaseUrl, anonKey);
  const { data: signInData, error: signInError } = await publicClient.auth.signInWithPassword({
    email: 'admin.ailms@gmail.com',
    password: '12345678',
  });

  if (signInError || !signInData.session) {
    console.error('[ERROR] Verification signInWithPassword failed:', signInError?.message);
    process.exit(1);
  }

  console.log('[SUCCESS] Credentials verified successfully with real Supabase Auth!');
  console.log(`Authenticated Session User: ${signInData.user?.email}`);
  console.log(`Token expires at: ${new Date(signInData.session.expires_at! * 1000).toLocaleString()}`);

  console.log('\n[3/3] Ready for Login!');
  console.log('Login at http://localhost:3000 with:');
  console.log('Email:    admin.ailms@gmail.com');
  console.log('Password: 12345678');
  console.log('=================================================================\n');
}

main().catch((err) => {
  console.error('[Unhandled Exception]:', err);
  process.exit(1);
});


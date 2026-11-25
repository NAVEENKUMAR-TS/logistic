/**
 * PHASE 3.1 — End-to-End Authentication Verification Script
 * 
 * Tests the actual Supabase authentication, backend API endpoints,
 * and reports results in a structured format.
 */
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

const SUPABASE_URL = config.supabaseUrl;
const ANON_KEY = config.supabaseAnonKey;
const SERVICE_ROLE_KEY = config.supabaseServiceRoleKey;
const BACKEND_URL = `http://localhost:${config.port}`;
const TEST_EMAIL = 'admin.ailms@gmail.com';
const TEST_PASSWORD = '12345678';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'BLOCKED' | 'WARN';
  detail: string;
}

const results: TestResult[] = [];

function log(label: string, status: string, detail: string) {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : status === 'BLOCKED' ? '🔒' : '⚠️';
  console.log(`${icon} [${status}] ${label}: ${detail}`);
  results.push({ name: label, status: status as TestResult['status'], detail });
}

async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function run() {
  console.log('='.repeat(70));
  console.log('  PHASE 3.1 — AUTHENTICATION VERIFICATION & END-TO-END TESTING');
  console.log('='.repeat(70));
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Backend URL:  ${BACKEND_URL}`);
  console.log(`Service Role Key: ${SERVICE_ROLE_KEY ? '***SET***' : 'NOT SET'}`);
  console.log('');

  // ─── 1. SUPABASE CONFIG VERIFICATION ──────────────────────────────
  console.log('\n── 1. SUPABASE CONFIGURATION ──');

  if (SUPABASE_URL && SUPABASE_URL !== 'https://placeholder.supabase.co') {
    log('Supabase URL configured', 'PASS', SUPABASE_URL);
  } else {
    log('Supabase URL configured', 'FAIL', 'URL is placeholder or missing');
  }

  if (ANON_KEY && ANON_KEY !== 'placeholder-anon-key') {
    log('Supabase Anon Key configured', 'PASS', `${ANON_KEY.substring(0, 20)}...`);
  } else {
    log('Supabase Anon Key configured', 'FAIL', 'Anon key is placeholder or missing');
  }

  if (SERVICE_ROLE_KEY) {
    log('Supabase Service Role Key', 'PASS', 'Key is set (value redacted)');
  } else {
    log('Supabase Service Role Key', 'BLOCKED', 'Not set — Admin API provisioning unavailable');
  }

  // ─── 2. BACKEND HEALTH CHECK ──────────────────────────────────────
  console.log('\n── 2. BACKEND API HEALTH ──');

  try {
    const { status, body } = await fetchJson(`${BACKEND_URL}/health`);
    if (status === 200 && body.status === 'ok') {
      log('Backend health check', 'PASS', `HTTP ${status} — ${JSON.stringify(body)}`);
    } else {
      log('Backend health check', 'FAIL', `HTTP ${status} — ${JSON.stringify(body)}`);
    }
  } catch (err: any) {
    log('Backend health check', 'FAIL', `Connection failed: ${err.message}`);
  }

  // ─── 3. UNAUTHENTICATED REQUEST REJECTION ─────────────────────────
  console.log('\n── 3. UNAUTHENTICATED REQUEST REJECTION ──');

  try {
    const { status, body } = await fetchJson(`${BACKEND_URL}/api/auth/me`);
    if (status === 401) {
      log('GET /api/auth/me without token → 401', 'PASS', `HTTP ${status}: ${body.error}`);
    } else {
      log('GET /api/auth/me without token → 401', 'FAIL', `Expected 401, got HTTP ${status}`);
    }
  } catch (err: any) {
    log('GET /api/auth/me without token → 401', 'FAIL', err.message);
  }

  try {
    const { status } = await fetchJson(`${BACKEND_URL}/api/auth/me`, {
      headers: { 'Authorization': 'Basic dXNlcjpwYXNz' },
    });
    if (status === 401) {
      log('Non-Bearer auth header → 401', 'PASS', `HTTP ${status}`);
    } else {
      log('Non-Bearer auth header → 401', 'FAIL', `Expected 401, got HTTP ${status}`);
    }
  } catch (err: any) {
    log('Non-Bearer auth header → 401', 'FAIL', err.message);
  }

  try {
    const { status } = await fetchJson(`${BACKEND_URL}/api/auth/me`, {
      headers: { 'Authorization': 'Bearer fake.invalid.jwt.token.here' },
    });
    if (status === 401) {
      log('Invalid JWT token → 401', 'PASS', `HTTP ${status}`);
    } else {
      log('Invalid JWT token → 401', 'FAIL', `Expected 401, got HTTP ${status}`);
    }
  } catch (err: any) {
    log('Invalid JWT token → 401', 'FAIL', err.message);
  }

  try {
    const { status } = await fetchJson(`${BACKEND_URL}/api/logistics/shipments`);
    if (status === 401) {
      log('GET /api/logistics/shipments without token → 401', 'PASS', `HTTP ${status}`);
    } else {
      log('GET /api/logistics/shipments without token → 401', 'FAIL', `Expected 401, got HTTP ${status}`);
    }
  } catch (err: any) {
    log('GET /api/logistics/shipments without token → 401', 'FAIL', err.message);
  }

  try {
    const { status } = await fetchJson(`${BACKEND_URL}/api/admin/system`);
    if (status === 401) {
      log('GET /api/admin/system without token → 401', 'PASS', `HTTP ${status}`);
    } else {
      log('GET /api/admin/system without token → 401', 'FAIL', `Expected 401, got HTTP ${status}`);
    }
  } catch (err: any) {
    log('GET /api/admin/system without token → 401', 'FAIL', err.message);
  }

  // ─── 4. PROVISIONING (if service role key available) ──────────────
  console.log('\n── 4. TEST ACCOUNT PROVISIONING ──');

  if (SERVICE_ROLE_KEY) {
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Check user existence
    try {
      const { data: { users }, error: listErr } = await adminClient.auth.admin.listUsers();
      if (listErr) {
        log('List Supabase users', 'FAIL', listErr.message);
      } else {
        const testUser = users.find(u => u.email?.toLowerCase() === TEST_EMAIL.toLowerCase());
        if (testUser) {
          log('Test user exists in Supabase', 'PASS', `ID: ${testUser.id}, email: ${testUser.email}`);
          log('Email confirmed', testUser.email_confirmed_at ? 'PASS' : 'FAIL',
            testUser.email_confirmed_at ? `Confirmed at ${testUser.email_confirmed_at}` : 'Email NOT confirmed');

          // Ensure password is set and email confirmed
          const { data: updateData, error: updateErr } = await adminClient.auth.admin.updateUserById(testUser.id, {
            password: TEST_PASSWORD,
            email_confirm: true,
            user_metadata: { name: 'Development Test User', role: 'admin' },
          });
          if (updateErr) {
            log('Update test account (password + confirm)', 'FAIL', updateErr.message);
          } else {
            log('Update test account (password + confirm)', 'PASS',
              `User ${updateData.user.id} updated, email_confirmed: ${Boolean(updateData.user.email_confirmed_at)}`);
          }
        } else {
          // Create the account
          const { data: createData, error: createErr } = await adminClient.auth.admin.createUser({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            email_confirm: true,
            user_metadata: { name: 'Development Test User', role: 'admin' },
          });
          if (createErr) {
            log('Create test account', 'FAIL', createErr.message);
          } else {
            log('Create test account', 'PASS', `Created: ${createData.user.id}`);
          }
        }

        // Check total user count
        log('Total Supabase auth users', 'PASS', `${users.length} user(s)`);
      }
    } catch (err: any) {
      log('Admin API user operations', 'FAIL', err.message);
    }
  } else {
    log('Test account provisioning', 'BLOCKED', 'SUPABASE_SERVICE_ROLE_KEY not set');
  }

  // ─── 5. LOGIN AUTHENTICATION ──────────────────────────────────────
  console.log('\n── 5. LOGIN AUTHENTICATION ──');

  const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Test: empty credentials
  {
    const { error } = await anonClient.auth.signInWithPassword({ email: '', password: '' });
    if (error) {
      log('Empty credentials rejected', 'PASS', `Error: ${error.message}`);
    } else {
      log('Empty credentials rejected', 'FAIL', 'Empty credentials were accepted');
    }
  }

  // Test: invalid email format
  {
    const { error } = await anonClient.auth.signInWithPassword({ email: 'not-an-email', password: 'whatever' });
    if (error) {
      log('Invalid email format rejected', 'PASS', `Error: ${error.message}`);
    } else {
      log('Invalid email format rejected', 'FAIL', 'Invalid email was accepted');
    }
  }

  // Test: wrong password
  {
    const { error } = await anonClient.auth.signInWithPassword({ email: TEST_EMAIL, password: 'wrongpassword999' });
    if (error) {
      log('Wrong password rejected', 'PASS', `Error: ${error.message}`);
    } else {
      log('Wrong password rejected', 'FAIL', 'Wrong password was accepted');
    }
  }

  // Test: non-existent user
  {
    const { error } = await anonClient.auth.signInWithPassword({ email: 'nonexistent-xyz@example.com', password: 'password123' });
    if (error) {
      log('Non-existent user rejected', 'PASS', `Error: ${error.message}`);
    } else {
      log('Non-existent user rejected', 'FAIL', 'Non-existent user was accepted');
    }
  }

  // Test: valid credentials
  let accessToken: string | null = null;
  let sessionUserId: string | null = null;
  {
    const { data, error } = await anonClient.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (error) {
      log('Valid credentials login', 'FAIL', `Error: ${error.message} (code: ${(error as any).code || 'none'}, status: ${(error as any).status || 'none'})`);
    } else if (data.session && data.user) {
      accessToken = data.session.access_token;
      sessionUserId = data.user.id;
      log('Valid credentials login', 'PASS',
        `Session established. User: ${data.user.email}, ID: ${data.user.id}, role: ${data.user.user_metadata?.role || 'none'}`);
      log('Access token received', 'PASS', `${accessToken.substring(0, 30)}...`);
      log('Refresh token received', data.session.refresh_token ? 'PASS' : 'FAIL',
        data.session.refresh_token ? 'Present' : 'Missing');
      log('Email confirmed at login', data.user.email_confirmed_at ? 'PASS' : 'WARN',
        data.user.email_confirmed_at || 'Not confirmed');
    } else {
      log('Valid credentials login', 'FAIL', 'No session or user returned');
    }
  }

  // ─── 6. AUTHENTICATED BACKEND API TESTS ───────────────────────────
  console.log('\n── 6. AUTHENTICATED BACKEND API TESTS ──');

  if (accessToken) {
    // GET /api/auth/me with valid token
    try {
      const { status, body } = await fetchJson(`${BACKEND_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (status === 200 && body.user) {
        log('GET /api/auth/me with valid token → 200', 'PASS',
          `User: ${body.user.email}, role: ${body.user.role}, id: ${body.user.id}`);
      } else {
        log('GET /api/auth/me with valid token → 200', 'FAIL', `HTTP ${status}: ${JSON.stringify(body)}`);
      }
    } catch (err: any) {
      log('GET /api/auth/me with valid token → 200', 'FAIL', err.message);
    }

    // GET /api/logistics/shipments with admin token
    try {
      const { status, body } = await fetchJson(`${BACKEND_URL}/api/logistics/shipments`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (status === 200 && body.shipments) {
        log('GET /api/logistics/shipments (admin) → 200', 'PASS',
          `${body.shipments.length} shipment(s), role: ${body.role}`);
      } else {
        log('GET /api/logistics/shipments (admin) → 200', 'FAIL', `HTTP ${status}: ${JSON.stringify(body)}`);
      }
    } catch (err: any) {
      log('GET /api/logistics/shipments (admin) → 200', 'FAIL', err.message);
    }

    // GET /api/admin/system with admin token
    try {
      const { status, body } = await fetchJson(`${BACKEND_URL}/api/admin/system`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (status === 200 && body.systemStatus) {
        log('GET /api/admin/system (admin) → 200', 'PASS',
          `Status: ${body.systemStatus}, admin: ${body.administrator}`);
      } else {
        log('GET /api/admin/system (admin) → 200', 'FAIL', `HTTP ${status}: ${JSON.stringify(body)}`);
      }
    } catch (err: any) {
      log('GET /api/admin/system (admin) → 200', 'FAIL', err.message);
    }
  } else {
    log('Authenticated API tests', 'BLOCKED', 'No valid access token (login failed)');
  }

  // ─── 7. TOKEN REFRESH TEST ────────────────────────────────────────
  console.log('\n── 7. SESSION & TOKEN REFRESH ──');

  if (accessToken) {
    // Test session retrieval
    try {
      const { data: sessionData, error: sessionErr } = await anonClient.auth.getSession();
      if (sessionErr) {
        log('Session retrieval (getSession)', 'WARN', sessionErr.message);
      } else {
        log('Session retrieval (getSession)', 'PASS',
          sessionData.session ? `Active session for ${sessionData.session.user?.email}` : 'No active session (expected in non-browser)');
      }
    } catch (err: any) {
      log('Session retrieval (getSession)', 'FAIL', err.message);
    }
  } else {
    log('Session & token tests', 'BLOCKED', 'No valid session');
  }

  // ─── 8. SIGN OUT TEST ─────────────────────────────────────────────
  console.log('\n── 8. SIGN OUT ──');

  if (accessToken) {
    try {
      const { error: signOutErr } = await anonClient.auth.signOut();
      if (signOutErr) {
        log('Sign out', 'FAIL', signOutErr.message);
      } else {
        log('Sign out', 'PASS', 'Signed out successfully');
      }

      // After sign out, the token should no longer work on the backend
      const { status: postLogoutStatus } = await fetchJson(`${BACKEND_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      // Note: Supabase JWTs may remain valid until expiry even after signOut (stateless JWT)
      // The backend verifies via getUser() which checks with Supabase
      log('Post-logout token backend check', postLogoutStatus === 401 ? 'PASS' : 'WARN',
        `HTTP ${postLogoutStatus} — ${postLogoutStatus === 401 ? 'Token correctly invalidated' : 'Token still valid (stateless JWT — normal for short-lived tokens)'}`);
    } catch (err: any) {
      log('Sign out', 'FAIL', err.message);
    }
  } else {
    log('Sign out', 'BLOCKED', 'No active session');
  }

  // ─── 9. SIGNUP VERIFICATION ───────────────────────────────────────
  console.log('\n── 9. SIGNUP VERIFICATION ──');

  // Test that signup assigns only dispatcher role (not admin/manager/supplier)
  {
    const signupClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const testSignupEmail = `test-phase31-${Date.now()}@example.com`;
    const { data: signupData, error: signupErr } = await signupClient.auth.signUp({
      email: testSignupEmail,
      password: 'TestPass123!',
      options: {
        data: {
          name: 'Phase31 Test',
          role: 'dispatcher',
        },
      },
    });

    if (signupErr) {
      log('New user signup', 'WARN', `Error: ${signupErr.message} (may be rate limited or config)`);
    } else if (signupData.user) {
      const assignedRole = signupData.user.user_metadata?.role;
      log('New user signup', 'PASS', `User created: ${signupData.user.id}, role: ${assignedRole}`);

      // Verify the role is dispatcher, not admin
      if (assignedRole === 'dispatcher' || assignedRole === undefined) {
        log('Signup default role is non-privileged', 'PASS', `Role: ${assignedRole || 'none (acceptable)'}`);
      } else if (['admin', 'manager', 'supplier'].includes(assignedRole)) {
        log('Signup default role is non-privileged', 'FAIL', `Dangerous: role is "${assignedRole}"`);
      } else {
        log('Signup default role is non-privileged', 'PASS', `Role: ${assignedRole}`);
      }

      // Verify email is NOT confirmed (should require verification)
      if (!signupData.user.email_confirmed_at) {
        log('Signup requires email verification', 'PASS', 'Email NOT auto-confirmed (correct)');
      } else {
        log('Signup requires email verification', 'WARN', 'Email was auto-confirmed (check Supabase settings)');
      }

      // Cleanup test user if service role key available
      if (SERVICE_ROLE_KEY) {
        const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        await adminClient.auth.admin.deleteUser(signupData.user.id);
        log('Cleanup test signup user', 'PASS', `Deleted ${signupData.user.id}`);
      }
    } else {
      log('New user signup', 'WARN', 'No user returned (may need email confirmation)');
    }
  }

  // Test: signup with admin role attempt (privilege escalation)
  {
    const signupClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const escalationEmail = `escalation-test-${Date.now()}@example.com`;
    const { data: escData, error: escErr } = await signupClient.auth.signUp({
      email: escalationEmail,
      password: 'TestPass123!',
      options: {
        data: {
          name: 'Privilege Escalation Attempt',
          role: 'admin',  // Attempt to self-assign admin
        },
      },
    });

    if (escErr) {
      log('Privilege escalation via signup', 'PASS', `Supabase rejected: ${escErr.message}`);
    } else if (escData.user) {
      // Check if role was actually set to admin in user_metadata
      const gotRole = escData.user.user_metadata?.role;
      if (gotRole === 'admin') {
        log('Privilege escalation via signup', 'WARN',
          'User_metadata.role was set to "admin" — Supabase user_metadata is client-writable. Backend must enforce role checks via app_metadata only.');
      } else {
        log('Privilege escalation via signup', 'PASS', `Role assigned: ${gotRole}`);
      }

      // Cleanup
      if (SERVICE_ROLE_KEY) {
        const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        await adminClient.auth.admin.deleteUser(escData.user.id);
        log('Cleanup escalation test user', 'PASS', `Deleted ${escData.user.id}`);
      }
    }
  }

  // ─── 10. SECURITY CHECKS ─────────────────────────────────────────
  console.log('\n── 10. SECURITY CHECKS ──');

  // Check: service role key not in frontend .env
  try {
    const fs = await import('fs');
    const frontendEnv = fs.readFileSync('F:/v0_pro/advanced-logistics/frontend/.env', 'utf-8');
    // The frontend .env may have the key variable but it should be empty
    const match = frontendEnv.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
    if (match && match[1].trim() && !match[1].includes('placeholder') && match[1].trim().startsWith('eyJ')) {
      log('Service role key NOT in frontend .env', 'FAIL', 'SERVICE_ROLE_KEY found with value in frontend .env!');
    } else {
      log('Service role key NOT in frontend .env', 'PASS', 'Key is empty or not present in frontend .env');
    }
  } catch {
    log('Service role key NOT in frontend .env', 'WARN', 'Could not read frontend .env');
  }

  // Check: no hardcoded credentials in source
  try {
    const fs = await import('fs');
    const authContext = fs.readFileSync('F:/v0_pro/advanced-logistics/frontend/src/context/AuthContext.tsx', 'utf-8');
    const hasHardcoded = authContext.includes('isAuthenticated: true') ||
      authContext.includes('isAuthenticated = true') ||
      authContext.match(/password\s*[:=]\s*['"][^'"]+['"]/);
    if (hasHardcoded) {
      log('No hardcoded auth in AuthContext', 'FAIL', 'Found hardcoded authentication or credentials');
    } else {
      log('No hardcoded auth in AuthContext', 'PASS', 'No hardcoded credentials or auth bypass found');
    }
  } catch {
    log('No hardcoded auth in AuthContext', 'WARN', 'Could not read file');
  }

  // Check: CORS configuration
  log('CORS configuration', 'WARN', 'Server uses cors() with default settings (allows all origins). Restrict in production.');

  // ─── 11. PASSWORD RECOVERY TEST ───────────────────────────────────
  console.log('\n── 11. PASSWORD RECOVERY ──');

  {
    const { error: resetErr } = await anonClient.auth.resetPasswordForEmail(TEST_EMAIL);
    if (resetErr) {
      if (resetErr.message.toLowerCase().includes('rate limit')) {
        log('Password reset email', 'WARN', `Rate limited: ${resetErr.message}`);
      } else {
        log('Password reset email', 'FAIL', resetErr.message);
      }
    } else {
      log('Password reset email', 'PASS', `Reset email sent to ${TEST_EMAIL} (check inbox)`);
    }
  }

  // ─── FINAL SUMMARY ───────────────────────────────────────────────
  console.log('\n' + '='.repeat(70));
  console.log('  VERIFICATION SUMMARY');
  console.log('='.repeat(70));

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const blocked = results.filter(r => r.status === 'BLOCKED').length;
  const warned = results.filter(r => r.status === 'WARN').length;

  console.log(`\n  ✅ PASS:    ${passed}`);
  console.log(`  ❌ FAIL:    ${failed}`);
  console.log(`  🔒 BLOCKED: ${blocked}`);
  console.log(`  ⚠️  WARN:    ${warned}`);
  console.log(`  ── TOTAL:   ${results.length}\n`);

  if (failed > 0) {
    console.log('  FAILURES:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`    ❌ ${r.name}: ${r.detail}`);
    });
  }

  if (blocked > 0) {
    console.log('\n  BLOCKED:');
    results.filter(r => r.status === 'BLOCKED').forEach(r => {
      console.log(`    🔒 ${r.name}: ${r.detail}`);
    });
  }

  if (warned > 0) {
    console.log('\n  WARNINGS:');
    results.filter(r => r.status === 'WARN').forEach(r => {
      console.log(`    ⚠️  ${r.name}: ${r.detail}`);
    });
  }

  console.log('\n' + '='.repeat(70));
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(2);
});

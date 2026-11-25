import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mjvuaxppjynytpkhbiox.supabase.co',
  'sb_publishable_kA6eAqXTMhD_7lgqCrQ2bg_gv0crtmd'
);

async function testEmails() {
  const candidates = [
    { email: 'abc@gmail.com', pass: '12345678' },
    { email: 'admin.ailms@gmail.com', pass: '12345678' },
    { email: 'developer@ailms-logix.com', pass: '12345678' },
  ];

  for (const c of candidates) {
    console.log(`\n--- Testing signUp for ${c.email} ---`);
    const res = await supabase.auth.signUp({
      email: c.email,
      password: c.pass,
      options: {
        data: {
          name: 'Dev Tester',
          role: 'admin',
        },
      },
    });

    if (res.error) {
      console.log('Error status:', res.error.status);
      console.log('Error message:', res.error.message);
      console.log('Error name:', res.error.name);
    } else {
      console.log('SUCCESS! User created:');
      console.log('ID:', res.data.user?.id);
      console.log('Email:', res.data.user?.email);
      console.log('Email confirmed at:', res.data.user?.email_confirmed_at);
      console.log('Session established:', Boolean(res.data.session));
    }
  }
}

testEmails().catch(console.error);

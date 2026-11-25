import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mjvuaxppjynytpkhbiox.supabase.co',
  'sb_publishable_kA6eAqXTMhD_7lgqCrQ2bg_gv0crtmd'
);

async function testBoth() {
  const rWrong = await supabase.auth.signInWithPassword({
    email: 'admin.ailms@gmail.com',
    password: 'wrong_password_999',
  });
  console.log('Wrong password response:', rWrong.error?.message);

  const rCorrect = await supabase.auth.signInWithPassword({
    email: 'admin.ailms@gmail.com',
    password: '12345678',
  });
  console.log('Password "12345678" response:', rCorrect.error?.message);
}

testBoth().catch(console.error);

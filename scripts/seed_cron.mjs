// One-off seed: push the current 12 OpenClaw cron jobs into the cron-jobs-v1
// Supabase row so the Schedules panel has data. Run with:
//   node scripts/seed_cron.mjs
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const get = k => (env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1]?.trim();
const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('NEXT_PUBLIC_SUPABASE_KEY'));

const jobs = JSON.parse(fs.readFileSync(new URL('./cron_seed.json', import.meta.url), 'utf8'));

const { error } = await supabase
  .from('tasks')
  .upsert({ id: 'cron-jobs-v1', data: jobs, updated_at: new Date().toISOString() });

if (error) { console.error('FAILED', error); process.exit(1); }
console.log(`Seeded ${jobs.length} cron jobs into cron-jobs-v1`);

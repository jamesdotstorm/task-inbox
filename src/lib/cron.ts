import { supabase } from './supabase';

// A snapshot of an OpenClaw cron job, plus a "desired" control layer the
// panel can edit. Torti (running on the Mac mini) reconciles desired -> actual
// on each heartbeat via scripts/cron_bridge.py.
export interface CronJob {
  id: string;                 // OpenClaw cron job id
  name: string;
  description?: string;
  // What the job actually does, in plain English (for the panel)
  summary?: string;
  recipients?: string[];      // who it messages, human-readable
  // Schedule
  cronExpr: string;           // e.g. "30 7 * * *"
  tz?: string;
  scheduleHuman?: string;     // e.g. "Daily 07:30 SAST"
  // Live status (written back by the bridge)
  enabled: boolean;
  lastRunAtMs?: number | null;
  lastRunStatus?: string | null;   // ok | error | null
  lastRunError?: string | null;
  nextRunAtMs?: number | null;
  // Desired control layer (edited by the panel, applied by the bridge)
  desiredEnabled?: boolean;        // if differs from enabled -> bridge toggles
  desiredCronExpr?: string | null; // if set & differs -> bridge reschedules
  pendingDelete?: boolean;         // panel requested removal
  // Bookkeeping
  category?: string;               // Morning | Weekly | Reminder | Ops | Research
  updatedAtMs?: number;
}

const ROW_ID = 'cron-jobs-v1';

export async function loadCronJobs(): Promise<CronJob[] | null> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('data')
      .eq('id', ROW_ID)
      .single();
    if (error || !data) return null;
    return data.data as CronJob[];
  } catch {
    return null;
  }
}

export async function saveCronJobs(jobs: CronJob[]): Promise<void> {
  try {
    await supabase
      .from('tasks')
      .upsert({ id: ROW_ID, data: jobs, updated_at: new Date().toISOString() });
  } catch (e) {
    console.error('Supabase cron save failed:', e);
  }
}

// Turn a cron expression into a friendly label. Handles the common shapes we use.
export function humanizeCron(expr: string, tz?: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return expr;
  const [min, hour, dom, mon, dow] = parts;
  const tzLabel = tz === 'Africa/Johannesburg' ? 'SAST' : tz || '';
  const time =
    /^\d+$/.test(hour) && /^\d+$/.test(min)
      ? `${hour.padStart(2, '0')}:${min.padStart(2, '0')}`
      : `${min} ${hour}`;

  const dowNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (dom === '*' && mon === '*' && dow === '*') return `Daily ${time} ${tzLabel}`.trim();
  if (dom === '*' && mon === '*' && /^\d+$/.test(dow))
    return `Weekly ${dowNames[+dow % 7]} ${time} ${tzLabel}`.trim();
  if (/^\d+$/.test(dom) && mon === '*' && dow === '*')
    return `Monthly (day ${dom}) ${time} ${tzLabel}`.trim();
  if (/^\d+$/.test(dom) && /^\d+$/.test(mon))
    return `${dom}/${mon} ${time} ${tzLabel}`.trim();
  return expr;
}

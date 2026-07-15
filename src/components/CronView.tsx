'use client';

import { useState, useEffect } from 'react';
import { CronJob, loadCronJobs, saveCronJobs, humanizeCron } from '@/lib/cron';

interface Props {
  dark: boolean;
}

function statusDot(job: CronJob) {
  if (!job.enabled) return { color: 'bg-gray-500', label: 'Off' };
  if (job.lastRunStatus === 'error') return { color: 'bg-red-500', label: 'Error' };
  if (job.lastRunStatus === 'ok') return { color: 'bg-green-400', label: 'OK' };
  return { color: 'bg-yellow-400', label: 'Pending' };
}

function fmtTime(ms?: number | null): string {
  if (!ms) return '—';
  const d = new Date(ms);
  return d.toLocaleString('en-ZA', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    timeZone: 'Africa/Johannesburg',
  });
}

const CATEGORY_ORDER = ['Morning', 'Weekly', 'Research', 'Ops', 'Reminder', 'Other'];

export default function CronView({ dark }: Props) {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [timeDraft, setTimeDraft] = useState('');

  useEffect(() => {
    loadCronJobs().then(j => {
      setJobs(j || []);
      setLoading(false);
    });
  }, []);

  const persist = (next: CronJob[]) => {
    setJobs(next);
    saveCronJobs(next);
  };

  const pendingCount = jobs.filter(
    j => (j.desiredEnabled !== undefined && j.desiredEnabled !== j.enabled)
      || (j.desiredCronExpr && j.desiredCronExpr !== j.cronExpr)
      || j.pendingDelete
  ).length;

  const toggle = (id: string) => {
    persist(jobs.map(j => {
      if (j.id !== id) return j;
      const current = j.desiredEnabled ?? j.enabled;
      return { ...j, desiredEnabled: !current, updatedAtMs: Date.now() };
    }));
  };

  const requestDelete = (id: string) => {
    persist(jobs.map(j => j.id === id ? { ...j, pendingDelete: !j.pendingDelete, updatedAtMs: Date.now() } : j));
  };

  const startEditTime = (job: CronJob) => {
    // Extract HH:MM from cron for the picker; fall back to raw expr
    const expr = job.desiredCronExpr || job.cronExpr;
    const [min, hour] = expr.trim().split(/\s+/);
    if (/^\d+$/.test(hour) && /^\d+$/.test(min)) {
      setTimeDraft(`${hour.padStart(2, '0')}:${min.padStart(2, '0')}`);
    } else {
      setTimeDraft('');
    }
    setEditing(job.id);
  };

  const saveTime = (job: CronJob) => {
    if (!/^\d{2}:\d{2}$/.test(timeDraft)) { setEditing(null); return; }
    const [hh, mm] = timeDraft.split(':');
    const parts = (job.desiredCronExpr || job.cronExpr).trim().split(/\s+/);
    parts[0] = String(+mm);
    parts[1] = String(+hh);
    const newExpr = parts.join(' ');
    persist(jobs.map(j => j.id === job.id
      ? { ...j, desiredCronExpr: newExpr === j.cronExpr ? null : newExpr, updatedAtMs: Date.now() }
      : j));
    setEditing(null);
  };

  const card = dark ? 'bg-[#1a1a1a] border-white/8' : 'bg-white border-gray-200 shadow-sm';
  const nameText = dark ? 'text-white' : 'text-gray-900';
  const subText = dark ? 'text-white/40' : 'text-gray-400';
  const bodyText = dark ? 'text-white/60' : 'text-gray-600';

  const grouped = CATEGORY_ORDER
    .map(cat => ({ cat, items: jobs.filter(j => (j.category || 'Other') === cat) }))
    .filter(g => g.items.length > 0);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className={`text-2xl font-bold ${nameText}`}>⏰ Schedules</h1>
        {pendingCount > 0 && (
          <span className="text-xs px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
            {pendingCount} change{pendingCount > 1 ? 's' : ''} pending — Torti applies on next sync
          </span>
        )}
      </div>
      <p className={`text-sm mb-6 ${subText}`}>
        Everything Torti runs on a schedule. Toggle off what you don&apos;t want, retime the rest.
        Changes are queued and applied by Torti on the Mac mini.
      </p>

      {loading && <p className={subText}>Loading schedules…</p>}
      {!loading && jobs.length === 0 && (
        <p className={subText}>No schedules synced yet. Ask Torti to run a cron sync.</p>
      )}

      {grouped.map(({ cat, items }) => (
        <div key={cat} className="mb-7">
          <h2 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${subText}`}>{cat}</h2>
          <div className="space-y-2.5">
            {items.map(job => {
              const dot = statusDot(job);
              const effectiveEnabled = job.desiredEnabled ?? job.enabled;
              const effectiveExpr = job.desiredCronExpr || job.cronExpr;
              const changed =
                (job.desiredEnabled !== undefined && job.desiredEnabled !== job.enabled)
                || (job.desiredCronExpr && job.desiredCronExpr !== job.cronExpr)
                || job.pendingDelete;

              return (
                <div
                  key={job.id}
                  className={`border rounded-xl p-4 ${card} ${job.pendingDelete ? 'opacity-50' : ''} ${changed ? 'ring-1 ring-amber-500/40' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${dot.color}`} title={dot.label} />
                      <div className="min-w-0">
                        <p className={`font-semibold text-sm ${nameText} ${job.pendingDelete ? 'line-through' : ''}`}>
                          {job.name}
                        </p>
                        {job.summary && <p className={`text-xs mt-0.5 ${bodyText}`}>{job.summary}</p>}
                        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs ${subText}`}>
                          {editing === job.id ? (
                            <span className="flex items-center gap-1">
                              <input
                                type="time"
                                value={timeDraft}
                                onChange={e => setTimeDraft(e.target.value)}
                                className={`px-2 py-0.5 rounded border text-xs ${dark ? 'bg-black/40 border-white/15 text-white' : 'bg-white border-gray-300'}`}
                              />
                              <button onClick={() => saveTime(job)} className="text-green-400 hover:text-green-300">✓</button>
                              <button onClick={() => setEditing(null)} className="text-red-400 hover:text-red-300">✕</button>
                            </span>
                          ) : (
                            <button
                              onClick={() => startEditTime(job)}
                              className={`hover:underline ${dark ? 'text-indigo-300' : 'text-indigo-600'}`}
                              title="Edit time"
                            >
                              🕐 {humanizeCron(effectiveExpr, job.tz)}
                            </button>
                          )}
                          {job.recipients && job.recipients.length > 0 && (
                            <span>→ {job.recipients.join(', ')}</span>
                          )}
                        </div>
                        <div className={`flex flex-wrap gap-x-3 mt-1.5 text-[11px] ${subText}`}>
                          <span>Last: {fmtTime(job.lastRunAtMs)}{job.lastRunStatus === 'error' ? ' ⚠️' : ''}</span>
                          <span>Next: {fmtTime(job.nextRunAtMs)}</span>
                        </div>
                        {job.lastRunError && (
                          <p className="text-[11px] text-red-400 mt-1 truncate" title={job.lastRunError}>
                            {job.lastRunError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggle(job.id)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${effectiveEnabled ? 'bg-green-500' : dark ? 'bg-white/15' : 'bg-gray-300'}`}
                        title={effectiveEnabled ? 'On' : 'Off'}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${effectiveEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                      <button
                        onClick={() => requestDelete(job.id)}
                        className={`text-[11px] ${job.pendingDelete ? 'text-amber-400' : dark ? 'text-white/30 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        {job.pendingDelete ? 'undo delete' : 'delete'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

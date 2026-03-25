import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
);

export async function POST(req: NextRequest) {
  const { taskTitle, senderPhone, senderName } = await req.json();

  const message = `Hi ${senderName || 'there'}! 🐢 Just letting you know that *${taskTitle}* has been paid. Thanks!`;

  // Store as a pending notification task — Torti polls and sends
  const pendingTask = {
    id: `notify-${Date.now()}`,
    title: `[NOTIFY] ${taskTitle}`,
    notes: JSON.stringify({ type: 'notify-paid', phone: senderPhone, message }),
    tags: ['_pending_notify'],
    filed: true,
    done: false,
    timing: 'do-now' as const,
    category: null,
    delegate: 'Torti',
    createdAt: new Date().toISOString(),
    scheduledDate: null,
    reviewDate: null,
    taskType: 'quick' as const,
    importance: 5 as const,
    subtasks: [],
    kanbanStatus: 'not-started' as const,
    isCollaborative: false,
  };

  const { data, error } = await supabase
    .from('tasks')
    .select('data')
    .eq('id', 'tasks-v1')
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: 'Could not load tasks' }, { status: 500 });
  }

  const tasks = data.data as unknown[];
  tasks.unshift(pendingTask);
  
  await supabase.from('tasks').upsert({ 
    id: 'tasks-v1', 
    data: tasks,
    updated_at: new Date().toISOString()
  });

  return NextResponse.json({ ok: true, method: 'queued' });
}

'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';

interface Props {
  tasks: Task[];
  dark: boolean;
  onOpen: (task: Task) => void;
  onUpdate: (task: Task) => void;
}

function TaskRow({ task, dark, onOpen, onUpdate }: { task: Task; dark: boolean; onOpen: (t: Task) => void; onUpdate: (t: Task) => void; overdue?: boolean }) {
  const markDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ ...task, done: !task.done, filed: true, kanbanStatus: !task.done ? 'finished' : 'not-started' });
  };
  return (
    <div onClick={() => onOpen(task)} className={`border rounded-xl px-4 py-3 cursor-pointer hover:border-indigo-500/40 transition-colors ${dark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={markDone}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            task.done ? 'bg-green-500 border-green-500 text-white' : dark ? 'border-white/20 hover:border-green-400' : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {task.done && <span className="text-xs leading-none">✓</span>}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${task.done ? 'line-through opacity-40' : ''} ${dark ? 'text-white' : 'text-gray-800'}`}>{task.title}</p>
          {task.taskType === 'project' && task.subtasks.length > 0 && (
            <p className={`text-xs mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>{task.subtasks.filter(s => s.done).length}/{task.subtasks.length} subtasks</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {task.category && <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'}`}>{task.category}</span>}
          {task.delegate && <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">{task.delegate}</span>}
          {task.importance && <span className="text-yellow-400/70 text-xs">{'★'.repeat(task.importance)}</span>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, tasks, dark, empty, onOpen, onUpdate }: { title: string; icon: string; tasks: Task[]; dark: boolean; empty: string; onOpen: (t: Task) => void; onUpdate: (t: Task) => void }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span>{icon}</span>
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? 'text-white/50' : 'text-gray-500'}`}>{title}</h2>
        {tasks.length > 0 && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'}`}>{tasks.length}</span>
        )}
      </div>
      {tasks.length === 0 ? (
        <p className={`text-sm italic ${dark ? 'text-white/20' : 'text-gray-300'}`}>{empty}</p>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => <TaskRow key={task.id} task={task} dark={dark} onOpen={onOpen} onUpdate={onUpdate} />)}
        </div>
      )}
    </div>
  );
}

export default function TodayView({ tasks, dark, onOpen, onUpdate }: Props) {
  const [hideDone, setHideDone] = useState(true);
  const today = new Date().toISOString().slice(0, 10);
  const filed = tasks.filter(t => t.filed);

  const visible = (list: Task[]) => hideDone ? list.filter(t => !t.done) : list;

  const doNow = visible(filed.filter(t => t.timing === 'do-now' && t.taskType === 'quick' && !t.delegate));
  const projects = visible(filed.filter(t => t.timing === 'do-now' && t.taskType === 'project'));
  const scheduledToday = visible(filed.filter(t => t.timing === 'schedule' && t.scheduledDate === today));
  const delegatedToday = visible(filed.filter(t => t.delegate && (t.timing === 'do-now' || t.scheduledDate === today)));
  const overdue = filed.filter(t => !t.done && t.scheduledDate && t.scheduledDate < today);

  const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const total = doNow.length + projects.length + scheduledToday.length + delegatedToday.length + overdue.length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Today&apos;s Mission</h1>
          <p className={`text-sm mt-1 ${dark ? 'text-white/40' : 'text-gray-400'}`}>{dateStr}</p>
        </div>
        <button
          onClick={() => setHideDone(h => !h)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors mt-1 ${
            hideDone
              ? dark ? 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' : 'border-indigo-300 text-indigo-600 bg-indigo-50'
              : dark ? 'border-white/10 text-white/40 hover:text-white' : 'border-gray-200 text-gray-400 hover:text-gray-700'
          }`}
        >
          {hideDone ? '✓ Hide done' : '○ Show done'}
        </button>
      </div>

      {total === 0 ? (
        <div className={`text-center py-20 ${dark ? 'text-white/20' : 'text-gray-300'}`}>
          <div className="text-5xl mb-3">🎯</div>
          <p className={`text-lg font-medium ${dark ? 'text-white/40' : 'text-gray-400'}`}>Nothing for today</p>
          <p className="text-sm">Set tasks to &quot;Do Now&quot; or schedule them for today</p>
        </div>
      ) : (
        <>
          {overdue.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span>⚠️</span>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-red-400">Overdue</h2>
                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">{overdue.length}</span>
              </div>
              <div className="space-y-2">
                {overdue.map(task => (
                  <div key={task.id} className={`border border-red-500/20 rounded-xl px-4 py-3 ${dark ? 'bg-red-950/20' : 'bg-red-50'}`}>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={e => { e.stopPropagation(); onUpdate({ ...task, done: true, filed: true, kanbanStatus: 'finished' }); }}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all border-red-400/50 hover:border-green-400 hover:bg-green-500`}
                      >
                        <span className="text-xs leading-none text-transparent hover:text-white">✓</span>
                      </button>
                      <div className="flex-1 cursor-pointer" onClick={() => onOpen(task)}>
                        <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{task.title}</p>
                        <p className="text-xs text-red-400 mt-0.5">Due {task.scheduledDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.category && <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'}`}>{task.category}</span>}
                        {task.delegate && <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">{task.delegate}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Section title="Quick Tasks" icon="⚡" tasks={doNow} dark={dark} empty="No quick tasks for today" onOpen={onOpen} onUpdate={onUpdate} />
          <Section title="Projects" icon="🗂" tasks={projects} dark={dark} empty="No projects for today" onOpen={onOpen} onUpdate={onUpdate} />
          <Section title="Scheduled Today" icon="📅" tasks={scheduledToday} dark={dark} empty="Nothing scheduled for today" onOpen={onOpen} onUpdate={onUpdate} />
          <Section title="Delegated Today" icon="👥" tasks={delegatedToday} dark={dark} empty="No delegated tasks for today" onOpen={onOpen} onUpdate={onUpdate} />
        </>
      )}
    </div>
  );
}

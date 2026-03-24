'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import TaskCard from './TaskCard';

interface Props {
  tasks: Task[];
  onUpdate: (task: Task) => void;
  onFile: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdd: (title: string) => void;
}

export default function InboxView({ tasks, onUpdate, onFile, onDelete, onAdd }: Props) {
  const [input, setInput] = useState('');

  const inboxTasks = tasks.filter(t => !t.filed);
  const filedTasks = tasks.filter(t => t.filed);

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput('');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Task Inbox</h1>
        <p className="text-white/40 text-sm mt-1">Capture first, organise later</p>
      </div>

      {/* Capture input */}
      <div className="flex gap-3 mb-8">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a task..."
          className="flex-1 bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          autoFocus
        />
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition-colors"
        >
          Add
        </button>
      </div>

      {/* Inbox tasks */}
      {inboxTasks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Inbox</h2>
            <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full font-medium">
              {inboxTasks.length}
            </span>
          </div>
          {inboxTasks.map(task => (
            <TaskCard key={task.id} task={task} onUpdate={onUpdate} onFile={onFile} onDelete={onDelete} />
          ))}
        </div>
      )}

      {inboxTasks.length === 0 && (
        <div className="text-center py-16 text-white/20">
          <div className="text-5xl mb-3">📥</div>
          <p className="text-lg font-medium text-white/40">Inbox is clear</p>
          <p className="text-sm">Add a task above to get started</p>
        </div>
      )}

      {/* Filed tasks */}
      {filedTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Filed</h2>
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
              {filedTasks.length}
            </span>
          </div>
          <div className="space-y-2">
            {filedTasks.map(task => (
              <div key={task.id} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="text-white/60 text-sm">{task.title}</span>
                  {task.delegate && (
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">{task.delegate}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {task.category && <span className="text-xs text-white/30">{task.category}</span>}
                  <button onClick={() => onDelete(task.id)} className="text-white/20 hover:text-red-400 text-lg leading-none ml-2">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

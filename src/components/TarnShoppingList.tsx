'use client';

import { Task } from '@/lib/types';

interface Props {
  tasks: Task[];
  dark: boolean;
  onOpen: (task: Task) => void;
  onUpdate: (task: Task) => void;
}

const isShoppingTag = (tag: string) =>
  tag.toLowerCase().replace(/[-_\s]/g, '').includes('tarnshoppinglist');

export default function TarnShoppingList({ tasks, dark, onOpen, onUpdate }: Props) {
  const items = tasks.filter(t => (t.tags || []).some(isShoppingTag) && !t.done);
  const bought = tasks.filter(t => (t.tags || []).some(isShoppingTag) && t.done);

  const markBought = (task: Task) => {
    onUpdate({ ...task, done: true, filed: true, kanbanStatus: 'finished' });
  };

  const markUnbought = (task: Task) => {
    onUpdate({ ...task, done: false });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>🛒 Tarn&apos;s Shopping List</h1>
        <p className={`text-sm mt-1 ${dark ? 'text-white/40' : 'text-gray-400'}`}>
          {items.length} to buy · {bought.length} done
        </p>
      </div>

      {items.length === 0 && (
        <div className={`text-center py-16 ${dark ? 'text-white/20' : 'text-gray-300'}`}>
          <div className="text-5xl mb-3">🛍️</div>
          <p className={`text-lg font-medium ${dark ? 'text-white/40' : 'text-gray-400'}`}>All clear!</p>
          <p className="text-sm">Nothing left to buy</p>
        </div>
      )}

      <div className="space-y-3 mb-10">
        {items.map(task => (
          <div
            key={task.id}
            className={`border rounded-2xl px-5 py-4 flex items-center justify-between gap-3 ${
              dark ? 'bg-[#1a1a1a] border-pink-500/20' : 'bg-white border-pink-200 shadow-sm'
            }`}
          >
            <div className="flex-1 cursor-pointer" onClick={() => onOpen(task)}>
              <p className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{task.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {task.category && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'}`}>
                    {task.category}
                  </span>
                )}
                {task.notes && (
                  <span className={`text-xs ${dark ? 'text-white/30' : 'text-gray-400'}`}>{task.notes.slice(0, 60)}{task.notes.length > 60 ? '…' : ''}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => markBought(task)}
              className="flex-shrink-0 text-sm px-4 py-1.5 rounded-lg font-medium transition-colors bg-pink-600 hover:bg-pink-700 text-white"
            >
              ✓ Got it
            </button>
          </div>
        ))}
      </div>

      {bought.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-white/30' : 'text-gray-400'}`}>✅ Bought</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/5 text-white/30' : 'bg-gray-100 text-gray-400'}`}>{bought.length}</span>
          </div>
          <div className="space-y-2">
            {bought.map(task => (
              <div
                key={task.id}
                className={`border rounded-xl px-4 py-3 flex items-center justify-between opacity-50 ${
                  dark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-pink-400 text-sm">✓</span>
                  <span className={`text-sm line-through ${dark ? 'text-white/60' : 'text-gray-500'}`}>{task.title}</span>
                </div>
                <button
                  onClick={() => markUnbought(task)}
                  className={`text-xs ${dark ? 'text-white/20 hover:text-white/50' : 'text-gray-300 hover:text-gray-500'}`}
                >
                  Undo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

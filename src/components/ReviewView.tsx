'use client';

import { Task } from '@/lib/types';

interface Props {
  tasks: Task[];
  dark: boolean;
  onOpen: (task: Task) => void;
  onUpdate: (task: Task) => void;
}

export default function ReviewView({ tasks, dark, onOpen, onUpdate }: Props) {
  const reviewTasks = tasks.filter(t => t.timing === 'review-next-week' && !t.done);

  const grouped = reviewTasks.reduce<Record<string, Task[]>>((acc, t) => {
    const d = t.reviewDate || 'Unscheduled';
    if (!acc[d]) acc[d] = [];
    acc[d].push(t);
    return acc;
  }, {});

  const sendToInbox = (task: Task) => {
    onUpdate({ ...task, timing: null, reviewDate: null, filed: false });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Tasks to Review</h1>
        <p className={`text-sm mt-1 ${dark ? 'text-white/40' : 'text-gray-400'}`}>
          These tasks will automatically return to your inbox on their review Monday.
        </p>
      </div>

      {reviewTasks.length === 0 ? (
        <div className={`text-center py-20 ${dark ? 'text-white/20' : 'text-gray-300'}`}>
          <div className="text-5xl mb-3">🔁</div>
          <p className={`text-lg font-medium ${dark ? 'text-white/40' : 'text-gray-400'}`}>Nothing to review</p>
          <p className="text-sm">Hit "Review Next Week" on any task to park it here</p>
        </div>
      ) : (
        Object.entries(grouped).sort().map(([date, dateTasks]) => {
          const isPast = date !== 'Unscheduled' && date <= new Date().toISOString().slice(0, 10);
          const label = date === 'Unscheduled' ? 'Unscheduled' :
            new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });

          return (
            <div key={date} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isPast ? 'text-amber-400' : dark ? 'text-white/40' : 'text-gray-400'}`}>
                  🔁 {label}
                </span>
                {isPast && <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Due for review</span>}
              </div>
              <div className="space-y-2">
                {dateTasks.map(task => (
                  <div
                    key={task.id}
                    className={`border rounded-xl px-4 py-3 ${isPast ? 'border-amber-500/30' : dark ? 'border-white/5' : 'border-gray-100'} ${dark ? 'bg-[#1a1a1a]' : 'bg-white shadow-sm'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 cursor-pointer" onClick={() => onOpen(task)}>
                        <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{task.title}</p>
                        {task.notes && <p className={`text-xs mt-0.5 ${dark ? 'text-white/30' : 'text-gray-400'}`}>{task.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {task.category && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'}`}>
                            {task.category}
                          </span>
                        )}
                        <button
                          onClick={() => sendToInbox(task)}
                          className={`text-xs px-2 py-1 rounded-lg border transition-all ${dark ? 'border-white/10 text-white/40 hover:border-indigo-400 hover:text-indigo-400' : 'border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500'}`}
                          title="Send back to inbox now"
                        >
                          → Inbox
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

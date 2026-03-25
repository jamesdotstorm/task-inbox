'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';

interface Props {
  tasks: Task[];
  dark: boolean;
  onOpen: (task: Task) => void;
  onUpdate: (task: Task) => void;
}

function extractSender(notes: string): { phone: string | null; name: string | null } {
  // Look for patterns like "Sender: +27606716091 (Tarn)" or "From: Tarn +27606716091"
  const phoneMatch = notes.match(/(?:sender|from)[^\n]*?(\+\d{10,15})/i);
  const nameMatch = notes.match(/(?:sender|from)[^\n]*?:\s*([A-Za-z]+)/i);
  return {
    phone: phoneMatch ? phoneMatch[1] : null,
    name: nameMatch ? nameMatch[1] : null,
  };
}

function parseNoteLines(notes: string): string[] {
  return notes.split('\n').filter(l => l.trim() && !l.toLowerCase().startsWith('sender:') && !l.toLowerCase().startsWith('from:'));
}

export default function BillsView({ tasks, dark, onOpen, onUpdate }: Props) {
  const [notifying, setNotifying] = useState<string | null>(null);
  const [notified, setNotified] = useState<Set<string>>(new Set());

  const bills = tasks.filter(t => (t.tags || []).includes('Bill to pay') && !t.done);
  const paidBills = tasks.filter(t => (t.tags || []).includes('Bill to pay') && t.done);

  const markPaid = (task: Task) => {
    onUpdate({ ...task, done: true, filed: true, kanbanStatus: 'finished' });
  };

  const markPaidAndNotify = async (task: Task) => {
    // Mark paid first
    onUpdate({ ...task, done: true, filed: true, kanbanStatus: 'finished' });

    // Extract sender from notes
    const { phone, name } = extractSender(task.notes || '');
    if (!phone) return; // No sender to notify

    setNotifying(task.id);
    try {
      await fetch('/api/notify-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: task.title, senderPhone: phone, senderName: name }),
      });
      setNotified(prev => new Set([...prev, task.id]));
    } catch {
      // Silent fail
    } finally {
      setNotifying(null);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>💸 Bills to Pay</h1>
        <p className={`text-sm mt-1 ${dark ? 'text-white/40' : 'text-gray-400'}`}>
          {bills.length} outstanding · {paidBills.length} paid
        </p>
      </div>

      {bills.length === 0 && (
        <div className={`text-center py-16 ${dark ? 'text-white/20' : 'text-gray-300'}`}>
          <div className="text-5xl mb-3">🎉</div>
          <p className={`text-lg font-medium ${dark ? 'text-white/40' : 'text-gray-400'}`}>All clear!</p>
          <p className="text-sm">No outstanding bills</p>
        </div>
      )}

      <div className="space-y-4 mb-10">
        {bills.map(task => {
          const noteLines = parseNoteLines(task.notes || '');
          const { phone, name } = extractSender(task.notes || '');
          const isNotifying = notifying === task.id;

          return (
            <div key={task.id} className={`border rounded-2xl overflow-hidden ${dark ? 'bg-[#1a1a1a] border-red-500/20' : 'bg-white border-red-200 shadow-sm'}`}>
              {/* Header */}
              <div className={`px-5 py-4 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 cursor-pointer" onClick={() => onOpen(task)}>
                    <p className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {task.category && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'}`}>
                          {task.category}
                        </span>
                      )}
                      {phone && (
                        <span className={`text-xs ${dark ? 'text-white/30' : 'text-gray-400'}`}>
                          from {name || phone}
                        </span>
                      )}
                    </div>
                  </div>
                  {task.importance && (
                    <span className="text-yellow-400/70 text-xs flex-shrink-0">{'★'.repeat(task.importance)}</span>
                  )}
                </div>
              </div>

              {/* Banking details */}
              {noteLines.length > 0 && (
                <div className={`px-5 py-4 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${dark ? 'text-white/30' : 'text-gray-400'}`}>Payment Details</p>
                  <div className="space-y-1.5">
                    {noteLines.map((line, i) => (
                      <p key={i} className={`text-sm ${dark ? 'text-white/70' : 'text-gray-700'}`}>{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className={`px-5 py-3 flex items-center justify-between gap-2 flex-wrap ${dark ? 'bg-white/2' : 'bg-gray-50'}`}>
                <p className={`text-xs ${dark ? 'text-white/20' : 'text-gray-400'}`}>
                  {task.delegate ? `Assigned to ${task.delegate}` : 'Unassigned'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => markPaid(task)}
                    className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors border ${dark ? 'border-white/10 text-white/50 hover:border-green-500/40 hover:text-green-400' : 'border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600'}`}
                  >
                    ✓ Paid
                  </button>
                  <button
                    onClick={() => markPaidAndNotify(task)}
                    disabled={isNotifying}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    {isNotifying ? '...' : phone ? '✓ Paid + Notify sender' : '✓ Mark as Paid'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paid bills */}
      {paidBills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-white/30' : 'text-gray-400'}`}>✅ Paid</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/5 text-white/30' : 'bg-gray-100 text-gray-400'}`}>{paidBills.length}</span>
          </div>
          <div className="space-y-2">
            {paidBills.map(task => (
              <div key={task.id} className={`border rounded-xl px-4 py-3 flex items-center justify-between opacity-50 ${dark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className={`text-sm line-through ${dark ? 'text-white/60' : 'text-gray-500'}`}>{task.title}</span>
                  {notified.has(task.id) && <span className="text-xs text-green-400">· sender notified</span>}
                </div>
                <button
                  onClick={() => onUpdate({ ...task, done: false })}
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

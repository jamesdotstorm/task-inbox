'use client';

import { useState, useEffect, useRef } from 'react';
import { Task } from '@/lib/types';

interface ChatMessage {
  id: string;
  text: string;
  author: 'Jamie' | 'Alon' | 'Note';
  createdAt: string;
  pinned?: boolean;
  tag?: 'decision' | 'action' | 'idea' | null;
}

const TAG_STYLES: Record<string, string> = {
  decision: 'bg-purple-600/20 text-purple-300 border border-purple-500/30',
  action: 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30',
  idea: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
};

const TAG_ICONS: Record<string, string> = {
  decision: '⚖️',
  action: '⚡',
  idea: '💡',
};

const SUPABASE_KEY = 'alon-jamie-chat';

async function loadChat(): Promise<ChatMessage[]> {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from('tasks')
      .select('tasks')
      .eq('id', SUPABASE_KEY)
      .single();
    return (data?.tasks as ChatMessage[]) || [];
  } catch {
    const saved = localStorage.getItem(SUPABASE_KEY);
    return saved ? JSON.parse(saved) : [];
  }
}

async function saveChat(messages: ChatMessage[]) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase
      .from('tasks')
      .upsert({ id: SUPABASE_KEY, tasks: messages });
  } catch {
    // fallback
  }
  localStorage.setItem(SUPABASE_KEY, JSON.stringify(messages));
}

interface Props {
  dark: boolean;
  tasks: Task[];
  onUpdate: (task: Task) => void;
  onOpen: (task: Task) => void;
}

export default function AlonJamieChat({ dark, tasks, onUpdate, onOpen }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [author, setAuthor] = useState<'Jamie' | 'Alon' | 'Note'>('Jamie');
  const [tag, setTag] = useState<'decision' | 'action' | 'idea' | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'decision' | 'action' | 'idea' | 'pinned'>('all');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Tasks tagged "Alon chat points" (not done)
  const alonTasks = tasks.filter(
    t => (t.tags || []).includes('Alon chat points') && !t.done
  );
  const doneTasks = tasks.filter(
    t => (t.tags || []).includes('Alon chat points') && t.done
  );

  useEffect(() => {
    loadChat().then(msgs => {
      setMessages(msgs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      author,
      createdAt: new Date().toISOString(),
      pinned: false,
      tag,
    };
    const updated = [...messages, msg];
    setMessages(updated);
    saveChat(updated);
    setInput('');
    setTag(null);
  };

  const togglePin = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, pinned: !m.pinned } : m);
    setMessages(updated);
    saveChat(updated);
  };

  const deleteMsg = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    saveChat(updated);
  };

  const markDone = (task: Task) => {
    onUpdate({ ...task, done: true });
  };

  const filtered = messages.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'pinned') return m.pinned;
    return m.tag === filter;
  });

  const base = dark ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900';
  const card = dark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200';
  const muted = dark ? 'text-white/40' : 'text-gray-400';
  const subtle = dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200';

  const authorColour = (a: string) =>
    a === 'Jamie' ? 'text-indigo-400' : a === 'Alon' ? 'text-emerald-400' : 'text-yellow-400';

  const authorBubble = (a: string) =>
    a === 'Jamie'
      ? 'bg-indigo-600/20 border border-indigo-500/30'
      : a === 'Alon'
      ? 'bg-emerald-600/20 border border-emerald-500/30'
      : 'bg-yellow-500/20 border border-yellow-500/30';

  return (
    <div className={`flex h-full ${base}`}>
      {/* Left: Agenda / Tasks pane */}
      <div className={`w-80 flex-shrink-0 border-r flex flex-col ${dark ? 'border-white/5 bg-[#111]' : 'border-gray-200 bg-white'}`}>
        <div className={`px-5 py-4 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
          <h2 className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>
            📋 Agenda Points
          </h2>
          <p className={`text-xs mt-0.5 ${muted}`}>Tasks tagged "Alon chat points"</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {alonTasks.length === 0 && (
            <p className={`text-xs text-center py-8 ${muted}`}>
              No open items.<br />Tag any task "Alon chat points" to add it here.
            </p>
          )}
          {alonTasks.map(task => (
            <div
              key={task.id}
              className={`rounded-lg p-3 border group ${card}`}
            >
              <div className="flex items-start gap-2">
                <button
                  onClick={() => markDone(task)}
                  className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                    dark ? 'border-white/20 hover:border-emerald-400 hover:bg-emerald-400/20' : 'border-gray-300 hover:border-emerald-500'
                  }`}
                  title="Mark done"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug cursor-pointer hover:text-indigo-400 transition-colors ${dark ? 'text-white/90' : 'text-gray-800'}`}
                    onClick={() => onOpen(task)}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {task.delegate && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${subtle} ${muted}`}>
                        👤 {task.delegate}
                      </span>
                    )}
                    {task.category && (
                      <span className={`text-xs ${muted}`}>{task.category}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {doneTasks.length > 0 && (
            <>
              <p className={`text-xs pt-3 pb-1 ${muted}`}>✅ Discussed</p>
              {doneTasks.slice(0, 5).map(task => (
                <div key={task.id} className={`rounded-lg p-3 border opacity-40 ${card}`}>
                  <p className={`text-sm line-through ${dark ? 'text-white/60' : 'text-gray-500'}`}>{task.title}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Right: Chat log */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between flex-shrink-0 ${dark ? 'border-white/5' : 'border-gray-200'}`}>
          <div>
            <h1 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
              💬 Alon &amp; Jamie Chat
            </h1>
            <p className={`text-sm mt-0.5 ${muted}`}>Shared notes, decisions, and ideas</p>
          </div>
          <div className={`text-xs px-3 py-1.5 rounded-full ${muted} ${subtle}`}>
            {messages.length} entries
          </div>
        </div>

        {/* Filter bar */}
        <div className={`px-6 py-3 border-b flex gap-2 flex-shrink-0 flex-wrap ${dark ? 'border-white/5' : 'border-gray-100'}`}>
          {(['all', 'pinned', 'decision', 'action', 'idea'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                filter === f ? 'bg-indigo-600 text-white' : `${subtle} ${muted}`
              }`}
            >
              {f === 'all' ? 'All' : f === 'pinned' ? '📌 Pinned' : `${TAG_ICONS[f]} ${f.charAt(0).toUpperCase() + f.slice(1)}s`}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {loading && <div className={`text-center py-10 text-sm ${muted}`}>Loading…</div>}
          {!loading && filtered.length === 0 && (
            <div className={`text-center py-20 ${muted}`}>
              <p className="text-4xl mb-3">💬</p>
              <p className="text-sm">{filter === 'all' ? 'No messages yet. Start the conversation!' : `No ${filter} entries yet.`}</p>
            </div>
          )}
          {filtered.map(msg => (
            <div
              key={msg.id}
              className={`rounded-xl p-4 border group relative ${card} ${msg.pinned ? (dark ? 'border-yellow-500/30' : 'border-yellow-300') : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${authorBubble(msg.author)} ${authorColour(msg.author)}`}>
                    {msg.author === 'Note' ? '📝 Note' : msg.author}
                  </span>
                  <div className="flex-1 min-w-0">
                    {msg.tag && (
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-1.5 ${TAG_STYLES[msg.tag]}`}>
                        {TAG_ICONS[msg.tag]} {msg.tag.charAt(0).toUpperCase() + msg.tag.slice(1)}
                      </span>
                    )}
                    <p className={`text-sm leading-relaxed ${dark ? 'text-white/90' : 'text-gray-800'}`}>{msg.text}</p>
                    <p className={`text-xs mt-1.5 ${muted}`}>
                      {new Date(msg.createdAt).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}
                      {msg.pinned && <span className="ml-2">📌</span>}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => togglePin(msg.id)} className={`text-xs px-2 py-1 rounded ${subtle}`} title={msg.pinned ? 'Unpin' : 'Pin'}>📌</button>
                  <button onClick={() => deleteMsg(msg.id)} className={`text-xs px-2 py-1 rounded hover:text-red-400 ${subtle}`} title="Delete">🗑</button>
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className={`px-6 py-4 border-t flex-shrink-0 ${dark ? 'border-white/5 bg-[#161616]' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-xs ${muted}`}>From:</span>
            {(['Jamie', 'Alon', 'Note'] as const).map(a => (
              <button
                key={a}
                onClick={() => setAuthor(a)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  author === a ? authorBubble(a) + ' ' + authorColour(a) : subtle + ' ' + muted
                }`}
              >
                {a === 'Note' ? '📝 Note' : a}
              </button>
            ))}
            <span className={`text-xs ml-2 ${muted}`}>Tag:</span>
            {(['decision', 'action', 'idea'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTag(tag === t ? null : t)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  tag === t ? TAG_STYLES[t] : subtle + ' ' + muted
                }`}
              >
                {TAG_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Log a note, decision, or idea…"
              className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-colors ${
                dark
                  ? 'bg-white/5 text-white placeholder-white/30 focus:bg-white/10 border border-white/10 focus:border-indigo-500/50'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-gray-200 border border-transparent'
              }`}
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="px-5 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { loadFriendsFromSupabase, saveFriendsToSupabase } from '@/lib/supabase';

type AccessLevel = 'torti' | 'secretary' | 'both';
type Group = 'Scallywags' | 'Family' | 'Business' | 'Other';

interface Friend {
  id: string;
  name: string;
  phone: string;
  descriptor: string;
  group: Group;
  access: AccessLevel;
  redacted?: boolean;
  notes?: string;
}

const STORAGE_KEY = 'friends-directory-v1';

const SEED_FRIENDS: Friend[] = [
  { id: '1',  name: 'Tarn Hedley',           phone: '+27606716091', descriptor: "Jamie's wife",                  group: 'Family',      access: 'torti' },
  { id: '2',  name: 'Joanna',                phone: '+27784307929', descriptor: "Jamie's sister",               group: 'Family',      access: 'torti' },
  { id: '3',  name: 'Peuge / Michael Kennedy',phone: '+27686941058', descriptor: 'Quicket co-founder, best mate', group: 'Scallywags',  access: 'torti' },
  { id: '4',  name: 'James Tagg',            phone: '+27833018602', descriptor: 'Quicket co-founder, cellist',  group: 'Scallywags',  access: 'torti' },
  { id: '5',  name: 'Laura Baasch',          phone: '+27842002120', descriptor: 'Head of automation, Quicket',  group: 'Scallywags',  access: 'torti', notes: 'Can be called "bro". Chaotic good. IRC legend.' },
  { id: '6',  name: 'Nick Bush',             phone: '+27741749902', descriptor: 'Yacht "Drifter", in Kenya',    group: 'Scallywags',  access: 'torti' },
  { id: '7',  name: 'Stephen Fienberg',      phone: '+27833581848', descriptor: 'Critical, brilliant, strange', group: 'Scallywags',  access: 'torti', notes: '⚠️ Never put in same room as Steve, Nick, Jamie & Sean.' },
  { id: '8',  name: 'Sean Walpole',          phone: '+27823727797', descriptor: 'Runs Rentaroom',              group: 'Scallywags',  access: 'torti', notes: '⚠️ Never put in same room as Steve, Nick, Jamie & Stephen.' },
  { id: '9',  name: 'Steve Linde',           phone: '+27836084566', descriptor: 'Sells animal hides',          group: 'Scallywags',  access: 'torti', notes: '⚠️ Never put in same room as Nick, Jamie, Stephen & Sean.' },
  { id: '10', name: 'Wesley Kriedemann',     phone: '+27648996523', descriptor: "Super yacht captain, Laura's brother", group: 'Scallywags', access: 'torti' },
  { id: '11', name: 'Kuven',                 phone: '+27825628115', descriptor: 'Goes by "Magic" in WhatsApp', group: 'Other',       access: 'torti', notes: 'Has his own AI called David (offline for disciplinary action).' },
  { id: '12', name: 'Thomas van Alphen',     phone: '+27608356924', descriptor: 'Owns Hout and About, Hout Bay', group: 'Other',     access: 'torti' },
  { id: '13', name: 'Ivan Ayliffe',          phone: '+27763317456', descriptor: 'Copywriter, skydiver',        group: 'Other',       access: 'torti', notes: '"Will rock your world" — per Laura.' },
  { id: '14', name: 'Unknown (POPIA)',        phone: '+27832993761', descriptor: 'Info removed per POPIA request', group: 'Other',  access: 'torti', redacted: true },
  { id: '15', name: 'Unknown (POPIA)',        phone: '+27798580138', descriptor: 'Info removed per POPIA request', group: 'Other',  access: 'torti', redacted: true },
];

const GROUP_ORDER: Group[] = ['Scallywags', 'Family', 'Business', 'Other'];

const ACCESS_CONFIG: Record<AccessLevel, { label: string; badge: string; bg: string; dot: string; icon: string }> = {
  torti:     { label: 'Direct to Torti',  badge: 'bg-indigo-500/15 text-indigo-400', bg: 'border-indigo-500/20', dot: 'bg-indigo-400',  icon: '🐢' },
  secretary: { label: 'Secretary only',   badge: 'bg-blue-500/15 text-blue-400',     bg: 'border-blue-500/20',   dot: 'bg-blue-400',    icon: '📋' },
  both:      { label: 'Torti + Secretary',badge: 'bg-purple-500/15 text-purple-400', bg: 'border-purple-500/20', dot: 'bg-purple-400',  icon: '✨' },
};

const GROUP_ICONS: Record<Group, string> = {
  Scallywags: '🏴‍☠️',
  Family: '🏡',
  Business: '💼',
  Other: '🌍',
};

const BLANK_FRIEND: Omit<Friend, 'id'> = {
  name: '', phone: '', descriptor: '', group: 'Other', access: 'torti', notes: '',
};

interface Props {
  dark: boolean;
}

export default function FriendsView({ dark }: Props) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filter, setFilter] = useState<AccessLevel | 'all'>('all');
  const [groupFilter, setGroupFilter] = useState<Group | 'all'>('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Friend | null>(null);
  const [adding, setAdding] = useState(false);
  const [newFriend, setNewFriend] = useState<Omit<Friend, 'id'>>(BLANK_FRIEND);
  const [syncing, setSyncing] = useState(false);

  // Load from Supabase first, fall back to localStorage, seed if empty
  useEffect(() => {
    setSyncing(true);
    loadFriendsFromSupabase().then(remote => {
      if (remote && (remote as Friend[]).length > 0) {
        const data = remote as Friend[];
        setFriends(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const local = JSON.parse(raw) as Friend[];
            setFriends(local);
            // Push local data up to Supabase
            saveFriendsToSupabase(local);
          } else {
            setFriends(SEED_FRIENDS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_FRIENDS));
            saveFriendsToSupabase(SEED_FRIENDS);
          }
        } catch {
          setFriends(SEED_FRIENDS);
          saveFriendsToSupabase(SEED_FRIENDS);
        }
      }
      setSyncing(false);
    }).catch(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setFriends(raw ? JSON.parse(raw) : SEED_FRIENDS);
      } catch {
        setFriends(SEED_FRIENDS);
      }
      setSyncing(false);
    });
  }, []);

  const save = (updated: Friend[]) => {
    setFriends(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    saveFriendsToSupabase(updated); // async, fire and forget
  };

  const updateFriend = (f: Friend) => save(friends.map(x => x.id === f.id ? f : x));
  const deleteFriend = (id: string) => { save(friends.filter(x => x.id !== id)); if (editing?.id === id) setEditing(null); };
  const addFriend = () => {
    if (!newFriend.name.trim()) return;
    const f: Friend = { ...newFriend, id: Date.now().toString() };
    save([...friends, f]);
    setAdding(false);
    setNewFriend(BLANK_FRIEND);
  };

  const filtered = friends.filter(f => {
    if (filter !== 'all' && f.access !== filter) return false;
    if (groupFilter !== 'all' && f.group !== groupFilter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) &&
        !f.descriptor.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = GROUP_ORDER.reduce<Record<Group, Friend[]>>((acc, g) => {
    acc[g] = filtered.filter(f => f.group === g);
    return acc;
  }, { Scallywags: [], Family: [], Business: [], Other: [] });

  const totalByAccess = (a: AccessLevel) => friends.filter(f => f.access === a).length;

  // Styles
  const bg    = dark ? 'bg-[#0f0f0f]'   : 'bg-gray-50';
  const card  = dark ? 'bg-[#1a1a1a] border-white/8'  : 'bg-white border-gray-200 shadow-sm';
  const text  = dark ? 'text-white'     : 'text-gray-900';
  const sub   = dark ? 'text-white/40'  : 'text-gray-400';
  const inp   = dark ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-indigo-500'
                     : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400';
  const divider = dark ? 'border-white/5' : 'border-gray-100';

  return (
    <div className={`min-h-full p-6 max-w-5xl mx-auto`}>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className={`text-2xl font-bold ${text}`}>👥 Friends & Contacts</h1>
          <p className={`text-sm mt-1 ${sub}`}>Who can reach Torti directly, and who goes through the secretary</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${syncing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <span className={`text-xs ${sub}`}>{syncing ? 'Syncing...' : 'Synced to cloud'}</span>
          </div>
        </div>
        <button
          onClick={() => { setAdding(true); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          <span>+</span> Add friend
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(['torti', 'secretary', 'both'] as AccessLevel[]).map(a => {
          const cfg = ACCESS_CONFIG[a];
          const count = totalByAccess(a);
          return (
            <button
              key={a}
              onClick={() => setFilter(filter === a ? 'all' : a)}
              className={`border rounded-xl p-4 text-left transition-all ${card} ${filter === a ? cfg.bg : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{}} />
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className={`text-xs font-medium ${sub}`}>{cfg.icon} {cfg.label}</span>
              </div>
              <p className={`text-2xl font-bold ${text}`}>{count}</p>
              <p className={`text-xs ${sub}`}>{count === 1 ? 'contact' : 'contacts'}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name or role..."
          className={`flex-1 min-w-48 px-3 py-2 rounded-xl border text-sm outline-none transition-colors ${inp}`}
        />
        {/* Group filter */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setGroupFilter('all')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
              groupFilter === 'all'
                ? 'bg-indigo-600 text-white border-transparent'
                : dark ? 'bg-white/5 text-white/50 border-white/10 hover:text-white' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-900'
            }`}
          >All</button>
          {GROUP_ORDER.map(g => (
            <button
              key={g}
              onClick={() => setGroupFilter(groupFilter === g ? 'all' : g)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
                groupFilter === g
                  ? 'bg-indigo-600 text-white border-transparent'
                  : dark ? 'bg-white/5 text-white/50 border-white/10 hover:text-white' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-900'
              }`}
            >
              {GROUP_ICONS[g]} {g}
            </button>
          ))}
        </div>
      </div>

      {/* Add friend form */}
      {adding && (
        <div className={`border rounded-2xl p-5 mb-6 ${card} border-indigo-500/30`}>
          <h3 className={`text-sm font-bold mb-4 ${text}`}>➕ New Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input value={newFriend.name} onChange={e => setNewFriend(p => ({...p, name: e.target.value}))}
              placeholder="Name *" className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`} />
            <input value={newFriend.phone} onChange={e => setNewFriend(p => ({...p, phone: e.target.value}))}
              placeholder="Phone (e.g. +27821234567)" className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`} />
            <input value={newFriend.descriptor} onChange={e => setNewFriend(p => ({...p, descriptor: e.target.value}))}
              placeholder="Who are they?" className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`} />
            <input value={newFriend.notes || ''} onChange={e => setNewFriend(p => ({...p, notes: e.target.value}))}
              placeholder="Notes (optional)" className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`} />
            <select value={newFriend.group} onChange={e => setNewFriend(p => ({...p, group: e.target.value as Group}))}
              className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`}>
              {GROUP_ORDER.map(g => <option key={g} value={g}>{GROUP_ICONS[g]} {g}</option>)}
            </select>
            <select value={newFriend.access} onChange={e => setNewFriend(p => ({...p, access: e.target.value as AccessLevel}))}
              className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`}>
              <option value="torti">🐢 Direct to Torti</option>
              <option value="secretary">📋 Secretary only</option>
              <option value="both">✨ Both</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addFriend} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">Save</button>
            <button onClick={() => { setAdding(false); setNewFriend(BLANK_FRIEND); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${dark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Groups */}
      <div className="space-y-6">
        {GROUP_ORDER.map(group => {
          const items = grouped[group];
          if (items.length === 0) return null;
          return (
            <div key={group}>
              {/* Group header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{GROUP_ICONS[group]}</span>
                <h2 className={`text-sm font-bold uppercase tracking-wider ${sub}`}>{group}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-white/5 text-white/30' : 'bg-gray-100 text-gray-400'}`}>{items.length}</span>
              </div>

              <div className={`border rounded-2xl overflow-hidden ${card}`}>
                <div className={`divide-y ${dark ? 'divide-white/5' : 'divide-gray-100'}`}>
                  {items.map(friend => {
                    const cfg = ACCESS_CONFIG[friend.access];
                    const isEditing = editing?.id === friend.id;
                    return (
                      <div key={friend.id}>
                        {isEditing ? (
                          /* Edit row */
                          <div className={`px-5 py-4 space-y-3 ${dark ? 'bg-white/2' : 'bg-indigo-50/50'}`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input value={editing.name} onChange={e => setEditing(p => p && ({...p, name: e.target.value}))}
                                placeholder="Name" className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`} />
                              <input value={editing.phone} onChange={e => setEditing(p => p && ({...p, phone: e.target.value}))}
                                placeholder="Phone" className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`} />
                              <input value={editing.descriptor} onChange={e => setEditing(p => p && ({...p, descriptor: e.target.value}))}
                                placeholder="Who are they?" className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`} />
                              <input value={editing.notes || ''} onChange={e => setEditing(p => p && ({...p, notes: e.target.value}))}
                                placeholder="Notes" className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`} />
                              <select value={editing.group} onChange={e => setEditing(p => p && ({...p, group: e.target.value as Group}))}
                                className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`}>
                                {GROUP_ORDER.map(g => <option key={g} value={g}>{GROUP_ICONS[g]} {g}</option>)}
                              </select>
                              <select value={editing.access} onChange={e => setEditing(p => p && ({...p, access: e.target.value as AccessLevel}))}
                                className={`px-3 py-2 rounded-xl border text-sm outline-none ${inp}`}>
                                <option value="torti">🐢 Direct to Torti</option>
                                <option value="secretary">📋 Secretary only</option>
                                <option value="both">✨ Both</option>
                              </select>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => { updateFriend(editing); setEditing(null); }}
                                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors">Save</button>
                              <button onClick={() => setEditing(null)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>Cancel</button>
                              <button onClick={() => deleteFriend(friend.id)}
                                className="ml-auto px-4 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors">Delete</button>
                            </div>
                          </div>
                        ) : (
                          /* Display row */
                          <div
                            className={`px-5 py-3.5 flex items-center gap-4 group transition-colors cursor-pointer
                              ${dark ? 'hover:bg-white/2' : 'hover:bg-gray-50'}`}
                            onClick={() => !friend.redacted && setEditing(friend)}
                          >
                            {/* Avatar */}
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                              friend.redacted
                                ? dark ? 'bg-white/5 text-white/20' : 'bg-gray-100 text-gray-300'
                                : dark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                            }`}>
                              {friend.redacted ? '?' : friend.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Name + descriptor */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className={`text-sm font-semibold ${friend.redacted ? (dark ? 'text-white/30' : 'text-gray-300') : text}`}>
                                  {friend.redacted ? '••••••••' : friend.name}
                                </p>
                                {friend.notes && (
                                  <span title={friend.notes} className="text-xs opacity-60 cursor-help">⚠️</span>
                                )}
                              </div>
                              <p className={`text-xs truncate mt-0.5 ${sub}`}>
                                {friend.redacted ? 'Information removed per POPIA' : friend.descriptor}
                                {!friend.redacted && friend.phone && (
                                  <span className="ml-2 opacity-60">{friend.phone}</span>
                                )}
                              </p>
                              {friend.notes && !friend.redacted && (
                                <p className={`text-xs mt-0.5 italic truncate ${dark ? 'text-amber-400/60' : 'text-amber-600/70'}`}>
                                  {friend.notes}
                                </p>
                              )}
                            </div>

                            {/* Access badge */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.badge}`}>
                                {cfg.icon} {cfg.label}
                              </span>
                              {!friend.redacted && (
                                <span className={`text-xs opacity-0 group-hover:opacity-60 transition-opacity ${sub}`}>
                                  Edit
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className={`mt-8 rounded-2xl border p-5 ${card}`}>
        <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${sub}`}>Access Levels</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['torti', 'secretary', 'both'] as AccessLevel[]).map(a => {
            const cfg = ACCESS_CONFIG[a];
            return (
              <div key={a} className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                <div>
                  <p className={`text-sm font-semibold ${text}`}>{cfg.icon} {cfg.label}</p>
                  <p className={`text-xs ${sub} mt-0.5`}>
                    {a === 'torti' && 'Contacts on the WhatsApp allowlist — Torti handles them directly in real time.'}
                    {a === 'secretary' && 'Goes via the Telegram secretary bot — Torti queues their request for Jamie.'}
                    {a === 'both' && 'Can reach Torti directly AND via the secretary bot depending on context.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

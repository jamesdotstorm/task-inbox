'use client';

import { useState, useEffect, useMemo } from 'react';

type Resource = {
  title: string;
  author?: string;
  category?: string;
  kind?: string;
  length?: string;
  summary?: string;
  link?: string;
  tags?: string[];
};

const LIBRARY: Resource[] = [
  {
    title: 'Martin Daniels — 🫶',
    author: 'Martin Daniels',
    category: 'Video',
    kind: 'Video',
    length: '5:51',
    summary: 'Shared by Jamie. A short talk / clip (1.7M views). Watch and revisit.',
    link: 'https://www.facebook.com/MRxBADGER/videos/1284955153573604/',
    tags: ['martin daniels', 'video', 'facebook'],
  },
  {
    title: 'The Inner Look',
    author: 'Silo (Mario Rodríguez Cobos)',
    category: 'Spirituality',
    kind: 'Text',
    length: '20 chapters',
    summary:
      'A meditative guide on converting the non-meaning of life into meaning — the Force, inner unity, and the road of the inner look. The founding poetic-philosophical text of Siloism.',
    link: 'https://en.wikipedia.org/wiki/The_Inner_Look',
    tags: ['silo', 'meditation', 'meaning', 'the force', 'inner unity'],
  },
];

export default function LibraryPage() {
  const [dark, setDark] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  useEffect(() => {
    const saved = localStorage.getItem('dark-mode');
    if (saved !== null) setDark(saved === 'true');
  }, []);

  const toggleDark = () => {
    setDark(d => {
      localStorage.setItem('dark-mode', String(!d));
      return !d;
    });
  };

  const categories = useMemo(() => {
    const set = new Set(LIBRARY.map(i => i.category).filter(Boolean) as string[]);
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return LIBRARY.filter(i => {
      const catOk = cat === 'All' || i.category === cat;
      if (!catOk) return false;
      if (!needle) return true;
      const hay = [i.title, i.author, i.summary, i.category, (i.tags || []).join(' ')]
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [q, cat]);

  const bg = dark ? 'bg-[#0f0e0c]' : 'bg-[#faf8f2]';
  const text = dark ? 'text-[#efe9db]' : 'text-gray-800';
  const heading = dark ? 'text-white' : 'text-gray-900';
  const muted = dark ? 'text-[#a89f8a]' : 'text-gray-500';
  const panel = dark ? 'bg-[#17150f] border-[#2a271d]' : 'bg-white border-gray-200';
  const gold = 'text-[#e0c07a]';

  return (
    <div className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleDark}
          className={`px-3 py-2 rounded-xl border ${panel} text-sm`}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-14 pb-24">
        <header className="text-center mb-6">
          <div className="text-4xl">🕯️</div>
          <h1 className={`text-3xl font-serif mt-2 ${heading}`}>The Library</h1>
          <p className={`italic mt-1 ${muted}`}>A quiet shelf of texts worth returning to.</p>
        </header>

        <div className="mx-auto my-6 h-px max-w-[220px] bg-gradient-to-r from-transparent via-[#c9a24b] to-transparent" />

        <div className="flex justify-center mb-5">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            type="search"
            placeholder="Search titles, authors, ideas…"
            className={`w-full max-w-md px-4 py-3 rounded-xl border outline-none ${panel} ${text} focus:border-[#c9a24b]`}
          />
        </div>

        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-2 rounded-full border text-sm transition ${
                c === cat
                  ? 'bg-[#c9a24b] text-[#1a1710] border-[#c9a24b] font-semibold'
                  : `${panel} ${muted} hover:border-[#c9a24b]`
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((i, idx) => {
            const Card = (
              <>
                {i.category && (
                  <span className={`text-[11px] tracking-widest uppercase ${gold}`}>
                    {i.category}
                  </span>
                )}
                <h2 className={`text-xl font-serif mt-1 ${heading}`}>{i.title}</h2>
                {i.author && <p className={`text-sm mt-1 ${muted}`}>{i.author}</p>}
                {i.summary && <p className="mt-3 text-[15px] opacity-90">{i.summary}</p>}
                <div className={`mt-3 flex gap-4 flex-wrap text-xs ${muted}`}>
                  {i.kind && <span>{i.kind}</span>}
                  {i.length && <span>{i.length}</span>}
                  {i.link ? <span className={gold}>Open →</span> : <span>Local text</span>}
                </div>
              </>
            );
            const cls = `block rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:border-[#c9a24b] ${panel}`;
            return i.link ? (
              <a key={idx} href={i.link} target="_blank" rel="noopener noreferrer" className={cls}>
                {Card}
              </a>
            ) : (
              <div key={idx} className={cls}>
                {Card}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className={`text-center py-10 ${muted}`}>Nothing here yet under that filter.</p>
          )}
        </div>

        <footer className={`text-center text-xs mt-12 ${muted}`}>
          Curated slowly. 🐢
        </footer>
      </div>
    </div>
  );
}

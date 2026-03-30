'use client';

import { useState, useEffect } from 'react';

const PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD || 'turnstay2026';
const AUTH_KEY = 'mission-control-auth';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    setAuthed(stored === 'true');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      setAuthed(true);
    } else {
      setError('Incorrect password. Try again.');
      setInput('');
    }
  };

  // Still checking localStorage
  if (authed === null) return null;

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🐢</div>
            <h1 className="text-white text-2xl font-bold tracking-tight">Mission Control</h1>
            <p className="text-gray-500 text-sm mt-1">Jamie & Torti</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(''); }}
              placeholder="Password"
              autoFocus
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors text-sm"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem('mission-control-auth');
    window.location.reload();
  };
  return (
    <button
      onClick={handleLogout}
      className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
      title="Log out"
    >
      🔒 Lock
    </button>
  );
}

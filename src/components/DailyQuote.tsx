'use client';

import { useMemo } from 'react';

const QUOTES = [
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "The key is not to prioritise what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
  { text: "Productivity is never an accident. It is always the result of a commitment to excellence.", author: "Paul J. Meyer" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Do the hard jobs first. The easy jobs will take care of themselves.", author: "Dale Carnegie" },
  { text: "The future belongs to those who learn more skills and combine them in creative ways.", author: "Robert Greene" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
  { text: "The most dangerous risk of all — the risk of spending your life not doing what you want.", author: "Alan Watts" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "Absorb what is useful, discard what is not, add what is uniquely your own.", author: "Bruce Lee" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't rise to the level of your goals, you fall to the level of your systems.", author: "James Clear" },
  { text: "Compound interest is the eighth wonder of the world. He who understands it, earns it.", author: "Albert Einstein" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Move fast. Speed is one of your most important competitive advantages.", author: "Sam Altman" },
  { text: "The singularity is near. Every year brings us closer to a world of exponential possibility.", author: "Ray Kurzweil" },
  { text: "Humans who can work alongside AI will be the most productive in history.", author: "Reid Hoffman" },
  { text: "Time is the only resource you can't get more of. Spend it like it matters.", author: "Naval Ravikant" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Don't count the days. Make the days count.", author: "Muhammad Ali" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "If you want to go fast, go alone. If you want to go far, go together.", author: "African Proverb" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "You are the average of the five people you spend the most time with.", author: "Jim Rohn" },
  { text: "Clarity about what matters provides clarity about what does not.", author: "Cal Newport" },
];

interface Props {
  dark: boolean;
}

export default function DailyQuote({ dark }: Props) {
  const quote = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

  return (
    <div className={`px-5 py-3 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
      <p className={`text-xs italic leading-relaxed ${dark ? 'text-white/35' : 'text-gray-400'}`}>
        "{quote.text}"
      </p>
      <p className={`text-xs mt-1 font-medium ${dark ? 'text-white/20' : 'text-gray-300'}`}>
        — {quote.author}
      </p>
    </div>
  );
}

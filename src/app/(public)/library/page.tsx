'use client';

import { useState, useEffect, useMemo } from 'react';

type Resource = {
  title: string;
  author?: string;
  category?: string;
  kind?: string;
  length?: string;
  rating?: number;
  summary?: string;
  notes?: string[];
  link?: string;
  tags?: string[];
};

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span title={`${rating} / 5`} className="text-[#e0c07a] tracking-tight">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      <span className="opacity-30">{'☆'.repeat(5 - full - (half ? 1 : 0))}</span>
    </span>
  );
}

const LIBRARY: Resource[] = [
  {
    title: 'Zen Mind, Beginner’s Mind',
    author: 'Shunryu Suzuki',
    category: 'Core Philosophy',
    kind: 'Book',
    length: 'Core teaching #1',
    summary:
      'For beginner-mind, presence, and not over-gripping reality. Talks by a Sōtō Zen master on holding an open, empty, ready mind — “in the beginner’s mind there are many possibilities; in the expert’s mind there are few.”',
    notes: [
      'The heart of it: “beginner’s mind” — meeting each moment fresh, without the expert’s certainty that closes off possibility.',
      'Practice (zazen) isn’t a means to enlightenment; sitting *is* the realization. Presence over striving.',
      'Effortless effort: do the thing fully without grasping at results or gripping reality too tightly.',
    ],
    link: 'https://www.shambhala.com/zen-mind-beginner-s-mind-9781611808414.html',
    tags: ['zen', 'suzuki', 'presence', 'beginner mind', 'meditation', 'buddhism'],
  },
  {
    title: 'Man’s Search for Meaning',
    author: 'Viktor Frankl',
    category: 'Core Philosophy',
    kind: 'Book',
    length: 'Core teaching #2',
    summary:
      'For meaning, suffering, dignity, and choosing one’s inner stance. Frankl’s account of surviving the camps and the logotherapy that grew from it — the last human freedom is choosing your attitude in any circumstance.',
    notes: [
      'Central claim: meaning — not pleasure or power — is the primary human drive. We can bear almost any “how” if we have a “why.”',
      '“Everything can be taken from a man but one thing: the last of the human freedoms — to choose one’s attitude in any given set of circumstances.”',
      'Suffering that is unavoidable can still be met with dignity; meaning is found in work, in love, and in the stance we take toward unavoidable hardship.',
    ],
    link: 'https://www.beacon.org/Mans-Search-for-Meaning-P602.aspx',
    tags: ['frankl', 'meaning', 'logotherapy', 'suffering', 'dignity', 'stoicism'],
  },
  {
    title: 'The Gay Science (The Joyful Wisdom)',
    author: 'Friedrich Nietzsche',
    category: 'Core Philosophy',
    kind: 'Book',
    length: 'Core teaching #3',
    summary:
      'For joy, self-overcoming, freedom, and learning to say yes to life. The book where “God is dead” and the eternal recurrence first appear — a call to affirm existence and become who you are.',
    notes: [
      'Introduces the eternal recurrence as a test: could you will to live this exact life over and over, infinitely? If yes, you’ve affirmed life fully.',
      '“God is dead” appears here — less a boast than a diagnosis: the loss of inherited meaning, and the challenge to create our own values.',
      'Amor fati — love of fate — and joyful, playful wisdom as the antidote to nihilism. Self-overcoming, not comfort.',
    ],
    link: 'https://www.gutenberg.org/ebooks/52124',
    tags: ['nietzsche', 'joy', 'eternal recurrence', 'amor fati', 'self-overcoming', 'freedom'],
  },
  {
    title: 'Philosophical Investigations',
    author: 'Ludwig Wittgenstein',
    category: 'Core Philosophy',
    kind: 'Book',
    length: 'Core teaching #4',
    summary:
      'For language, meaning, perception, and how reality is shaped by use and context. Wittgenstein’s later work — meaning is not a hidden essence but how words are actually used in “language-games.”',
    notes: [
      '“The meaning of a word is its use in the language.” Meaning lives in practice and context, not in fixed definitions or mental pictures.',
      '“Language-games” and “forms of life”: words get their sense from the activities and shared human practices they’re embedded in.',
      'Many philosophical problems are really confusions produced *by* language — dissolve the tangle rather than “solve” the puzzle. Reality is shaped by how we describe and use it.',
    ],
    link: 'https://www.wiley-vch.de/en/areas-interest/humanities-social-sciences/philosophy-12pl/historical-western-philosophy-12pl4/wittgenstein-12pl45/philosophical-investigations-978-1-4051-5928-9',
    tags: ['wittgenstein', 'language', 'meaning', 'language-games', 'perception', 'context'],
  },
  {
    title: 'Process and Reality',
    author: 'Alfred North Whitehead',
    category: 'Core Philosophy',
    kind: 'Book',
    length: 'Core teaching #5',
    summary:
      'For reality as process, relation, and becoming rather than dead objects. Whitehead’s process philosophy — the world is made of events and experiences in constant becoming, not static substances.',
    notes: [
      'Core move: reality is not made of static “things” but of “actual occasions” — momentary events of experience that arise, relate, and perish.',
      'Everything is relational and in process: to be is to become, and to become is to be woven into everything else.',
      'Even the smallest units of reality have a form of “experience” (panexperientialism) — dissolving the hard split between mind and dead matter. A natural companion to the Fuentes consciousness thread.',
    ],
    link: 'https://www.simonandschuster.com/books/Process-and-Reality/Alfred-North-Whitehead/9780029345702',
    tags: ['whitehead', 'process', 'becoming', 'relation', 'metaphysics', 'experience'],
  },
  {
    title: 'Michael Sugrue Lectures',
    author: 'Dr. Michael Sugrue',
    category: 'Teachers & Podcasts',
    kind: 'Lecture series',
    length: 'Supporting',
    summary:
      'Masterful one-hour lectures walking through the great philosophers — Plato, the Stoics, Nietzsche, Kant and more — with clarity, warmth and depth. A superb companion to the core reading.',
    link: 'https://www.youtube.com/@dr.michaelsugrue',
    tags: ['sugrue', 'lectures', 'philosophy', 'history of ideas'],
  },
  {
    title: 'The Partially Examined Life',
    author: 'PEL (podcast)',
    category: 'Teachers & Podcasts',
    kind: 'Podcast',
    length: 'Supporting',
    summary:
      'A philosophy podcast by former grad students — close, conversational readings of primary texts. Rigorous but accessible; good for going deeper on any of the core five.',
    link: 'https://partiallyexaminedlife.com/',
    tags: ['podcast', 'philosophy', 'primary texts', 'discussion'],
  },
  {
    title: 'Closer To Truth',
    author: 'Robert Lawrence Kuhn',
    category: 'Teachers & Podcasts',
    kind: 'Interviews',
    length: 'Supporting',
    summary:
      'Long-running interview series on consciousness, cosmology, meaning and God — the biggest questions, asked of leading scientists and philosophers. Directly feeds the consciousness / fundamental-reality thread.',
    link: 'https://closertotruth.com/',
    tags: ['consciousness', 'cosmology', 'meaning', 'interviews', 'big questions'],
  },
  {
    title: 'Alan Watts Talks',
    author: 'Alan Watts',
    category: 'Teachers & Podcasts',
    kind: 'Talks',
    length: 'Supporting',
    summary:
      'The great populariser of Zen and Eastern philosophy for the West — playful, poetic talks on the self, ego, time and letting go. A perfect bridge into Zen Mind, Beginner’s Mind.',
    link: 'https://alanwatts.com/',
    tags: ['alan watts', 'zen', 'eastern philosophy', 'ego', 'talks'],
  },
  {
    title: 'The Five Truths Hidden in 190+ Sacred Texts',
    author: 'YouTube essay',
    category: 'Spirituality',
    kind: 'Video',
    length: '~30 min',
    rating: 4,
    summary:
      'A creator who has read 190+ sacred texts across every major civilisation argues they all — despite never meeting — point to the same five truths. The differences are just flawed human language wrapped around one universal reality.',
    notes: [
      'Framing: if Truth (capital T) is real it should show up everywhere, like gravity or maths — independent of culture. Texts written thousands of miles and years apart with no contact keep whispering the same message; the contradictions are translation problems, not different truths. Language is “a net with holes too wide to catch the infinite” (Lao Tzu: “the Tao that can be spoken is not the eternal Tao”; Jesus spoke in parables).',
      '1. You are not separate. “Tat tvam asi” (Upanishads), “the kingdom of God is within you,” Sufi “you are the ocean in a drop,” Buddhism’s no-separate-self, quantum “one field fragmented by perception.” The wave is just the ocean briefly taking form. Separation is the root of fear, scarcity and ego.',
      '2. Fear is an illusion; love is the truth. “Do not be afraid” is the Bible’s most repeated phrase. “Perfect love casts out fear.” Love here means oneness/alignment, not romance — our default state we return to, not something we find.',
      '3. Your mind is a projector, not a camera. “What you think, you become” (Dhammapada), “all is mind” (Hermetic), maya (Vedanta), “the universe arises from consciousness” (Upanishads), observer effect in quantum physics. Consciousness isn’t in the universe — the universe is in consciousness. Hence stillness, silence and meditation.',
      '4. The enemy is the ego, not the world. “The self must conquer the lower self” (Gita), “die to yourself” (Jesus), “suffering begins with attachment to self” (Buddha). The ego is a survival mask stitched from fear that needs separation, hierarchy and recognition to exist — a ripple that thinks it’s the ocean.',
      '5. Everything is connected. “As above, so below,” Kabbalah’s tree of life, quantum entanglement, Taoist complementarity, Buddhist “interbeing,” Native American “we are all relatives.” You’re a neuron in a cosmic brain; life happens through you and as you.',
      'Why we forgot: not a conspiracy — fear became a tool, then a habit, then a culture. Modern apps, algorithms and outrage cycles weaponise attention; we traded meaning for dopamine and “who am I?” for “who do they think I am?” Anxiety, addiction and loneliness are the symptoms.',
      'The way back (the awakening road-map): truth (“the truth will set you free”), presence (“concentrate the mind on the present”), compassion/service (loving others because you *are* them), stillness & self-knowledge (“know thyself and you will know the universe”), and turning suffering into wisdom. Awakening isn’t adding anything — it’s stripping away noise to remember what you always were.',
    ],
    link: 'https://www.youtube.com/watch?v=ADYdypHZb2A',
    tags: ['spirituality', 'perennial philosophy', 'consciousness', 'ego', 'oneness', 'sacred texts', 'awakening'],
  },
  {
    title: 'Could Consciousness Be Fundamental?',
    author: 'Ivette Fuentes (New Scientist)',
    category: 'Consciousness',
    kind: 'Video',
    length: '~43 min interview',
    summary:
      'Quantum physicist Ivette Fuentes on why unifying physics may require changing quantum mechanics — not quantizing gravity — and how that leads to a view where consciousness is fundamental, its own "arena" alongside space-time.',
    notes: [
      'Physics has two pillars that don\u2019t fit: quantum mechanics (absolute time, superposition) and general relativity (relative time, mass curves space-time). Most physicists try to quantize gravity; Fuentes (following Roger Penrose) argues we should keep relativity solid and change quantum mechanics instead. Her line: \u201cwe\u2019re going wrong at trying to quantize space-time.\u201d',
      'Testable bet: gravity causes wave-function collapse. Superpositions are stable when mass is tiny, but once something is massive enough gravity forces it into one location \u2014 which is why we never see a coffee cup in two places. This implies a single universe, not \u201cmany worlds\u201d (which she dislikes).',
      'Her experimental angle: use Bose-Einstein condensates (the coldest matter we can make) as ultra-sensitive detectors \u2014 e.g. for high-frequency gravitational waves. She proposed this before LIGO\u2019s first detection.',
      'On consciousness (the memorable bit): she\u2019s moving toward a dualism where mind and matter are both fundamental and interact. \u201cSpace-time is the arena where atoms and fields interact; consciousness is the arena where thoughts and perceptions take place.\u201d Nobody knows how the two arenas connect \u2014 but they clearly do (a thought can give you a stomach ache).',
      'Origin story: she became a physicist as a teenager asking \u201chow does thought emerge from atoms?\u201d \u2014 nobody could answer, so she studied physics.',
    ],
    link: 'https://youtu.be/kLDvk2urghs',
    tags: ['consciousness', 'quantum', 'ivette fuentes', 'new scientist', 'physics', 'mind', 'penrose'],
  },
  {
    title: 'Update On My Brain Disease',
    author: 'Bruce Lipton-style creator (personal health documentary)',
    category: 'Health',
    kind: 'Video',
    length: '~15 min',
    rating: 5,
    summary:
      'A behavioural-science creator documents recovering from temporal lobe epilepsy — nine seizures a day, memory failing so badly he sometimes didn’t recognise his wife or newborn daughter — after the standard prescription (whose most common side effect was… seizures) offered no path to repair. Instead he built a mitochondria-first neurology protocol around methylene blue, high-dose melatonin, red-light therapy, beetroot and nature. Nine months in: from nine seizures a day to zero. Not medical advice, but a striking, hopeful case study in mitochondrial and brain health.',
    notes: [
      'The setup: diagnosed with temporal lobe epilepsy (possible mesial temporal sclerosis), ~9 seizures/day with amnesia (so he often didn’t know they were happening — people had seen them for ~3 years). Standard drug treated symptoms only; when he asked for anything that could *reverse* the damage or address the underlying cause, he got nothing — and the drug’s most common side effect was seizures.',
      'Core thesis — mitochondria first: mitochondria are the cell’s power plants (ATP), and “almost every chronic disease from diabetes to neurodegeneration traces back to mitochondrial dysfunction… but mitochondria is also the beginning of health.” Fix the energy system, give the brain a chance to repair.',
      'Methylene blue: a cheap 1800s fabric dye — the original “magic bullet” — used in medicine since ~1890. Crosses the blood-brain barrier, boosts mitochondrial efficiency, supports neurons, reduces oxidative stress, and works synergistically with red-light therapy (light is absorbed and used by methylene blue). His claim on why it’s obscure: patent long expired, cheap to make, so no one markets it — doctors simply aren’t taught it.',
      'High-dose melatonin (not the 2 mg sleep pill — doses ~200 mg, taken as a suppository to bypass the liver’s first-pass effect): powerful antioxidant, anti-inflammatory, immune and mood support, and doesn’t suppress your own melatonin production (no crash/rebound). He reports waking up “better than in my 20s.”',
      'Supporting pieces: red-light therapy, beetroot powder (nitrites → nitric oxide → blood flow + betalain antioxidants), and endonasal/breathing work (a deviated septum limiting left-nostril airflow, tied to parasympathetic/right-brain balance and brain perfusion). He also describes a legal, therapeutic ~4g psilocybin session and feeling neurons “wiring back together.”',
      'The big-picture line that shook him: “the further a creature is removed from its natural environment, the more it suffers disease” — “we don’t thrive in nature, we *are* nature.” He and his family sold their house and moved for constant exposure to nature. “Distance from descendants is disease.”',
      'Outcome & framing: 9 months in, nine seizures/day → zero. He’s careful to say it may not last and it’s not medical advice — the goal is to prompt people to research and talk to their doctor. Closing ethos: “there is no benefit to pessimism… choose to live with compassion and relentless curiosity. We rise by lifting others.”',
      '⚠️ Personal note for Jamie: high-dose methylene blue and high-dose melatonin carry real interactions and risks (e.g. methylene blue + serotonergic drugs → serotonin syndrome). Worth running past Dr Angélique before trying anything — files nicely next to your BP-meds note.',
    ],
    link: 'https://www.youtube.com/watch?v=W4tXqcXeHHM',
    tags: ['brain health', 'mitochondria', 'methylene blue', 'melatonin', 'red light therapy', 'epilepsy', 'longevity', 'neuroscience', 'nature'],
  },
  {
    title: 'The Simulation Is About to Break… (Here’s What’s Coming Next)',
    author: 'Tom Campbell',
    category: 'Consciousness',
    kind: 'Video',
    length: 'Interview / talk',
    summary:
      'Physicist Tom Campbell (NASA/DoD background, author of “My Big TOE”) on reality as a virtual/simulated system in which consciousness — not matter — is fundamental. His framework treats the physical universe as information rendered for conscious “players,” and argues we’re approaching a turning point as more people wake up to the nature of the simulation.',
    notes: [
      'Core claim (My Big TOE): consciousness is the fundamental reality, and the physical universe is a virtual/information system — a “reality game” rendered for players, much like a computer simulation. Matter is the output, not the source.',
      'The purpose of the “game” is the evolution of consciousness toward lower entropy — growing up spiritually means shifting from fear and ego toward love, cooperation and care. Individual choices are the mechanism of that evolution.',
      'Space, time and physical constants are the rule-set of the virtual reality, not absolute bedrock — which is why probability, the observer effect and non-locality show up in quantum experiments. Reality is computed as needed, not stored in full.',
      'The “simulation breaking” framing: a tipping point where enough people recognise the game for what it is, loosening the grip of fear-based systems and opening a shift in collective consciousness — with big implications for how we live, choose and treat each other.',
      'Sits alongside the Fuentes “consciousness as fundamental” and perennial-philosophy threads in this library — a scientist arriving at oneness/consciousness-first conclusions from physics and his own consciousness research.',
    ],
    link: 'https://youtu.be/GlGNMEdTMyA',
    tags: ['tom campbell', 'my big toe', 'simulation', 'consciousness', 'virtual reality', 'physics', 'metaphysics'],
  },
  {
    title: 'Martin Daniels — 🫶',
    author: 'Martin Daniels',
    category: 'Video',
    kind: 'Video',
    length: '5:51',
    summary: 'Shared by Jamie (1.7M views). Summary pending \u2014 Facebook blocks auto-reading; add a one-liner and I\u2019ll fill this in.',
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
    notes: [
      'Written as 20 short poetic chapters, each framed as a \u201cday\u201d of meditation. Moves from confronting the non-meaning of life (if everything ends in death) toward discovering meaning through inner experience.',
      'Central concept is \u201cthe Force\u201d \u2014 a mental/vital energy that, when directed consciously, produces states of comprehension, unity and peace. Includes practical exercises (the sphere / \u201cexperience of peace\u201d).',
      'Twelve \u201cPrinciples\u201d act as ethical/psychological rules for inner unity \u2014 e.g. \u201cwhen you treat others as you want them to treat you, you liberate yourself,\u201d and \u201cif you pursue an end you enchain yourself; if everything you do is an end in itself you liberate yourself.\u201d',
      'Reframes heavens/hells, spirits and rituals as real *internal mental states*, not external realities \u2014 a psychology of the inner landscape rather than a doctrine.',
    ],
    link: 'https://en.wikipedia.org/wiki/The_Inner_Look',
    tags: ['silo', 'meditation', 'meaning', 'the force', 'inner unity'],
  },
];

export default function LibraryPage() {
  const [dark, setDark] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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
          <h1 className={`text-3xl font-serif mt-2 ${heading}`}>Cod’s Library</h1>
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
            const key = `${i.title}-${idx}`;
            const open = !!expanded[key];
            const cls = `rounded-2xl border p-5 transition hover:border-[#c9a24b] ${panel}`;
            return (
              <div key={key} className={cls}>
                {i.category && (
                  <span className={`text-[11px] tracking-widest uppercase ${gold}`}>
                    {i.category}
                  </span>
                )}
                <h2 className={`text-xl font-serif mt-1 ${heading}`}>{i.title}</h2>
                {i.author && <p className={`text-sm mt-1 ${muted}`}>{i.author}</p>}
                {i.summary && <p className="mt-3 text-[15px] opacity-90">{i.summary}</p>}

                {i.notes && i.notes.length > 0 && open && (
                  <ul className="mt-4 space-y-2.5 border-l-2 border-[#c9a24b]/30 pl-4">
                    {i.notes.map((n, ni) => (
                      <li key={ni} className="text-[14px] leading-relaxed opacity-85">
                        {n}
                      </li>
                    ))}
                  </ul>
                )}

                <div className={`mt-3 flex gap-4 flex-wrap items-center text-xs ${muted}`}>
                  {typeof i.rating === 'number' && <Stars rating={i.rating} />}
                  {i.kind && <span>{i.kind}</span>}
                  {i.length && <span>{i.length}</span>}
                  {i.notes && i.notes.length > 0 && (
                    <button
                      onClick={() => setExpanded(e => ({ ...e, [key]: !open }))}
                      className={`${gold} hover:underline`}
                    >
                      {open ? 'Hide notes ↑' : 'Read notes ↓'}
                    </button>
                  )}
                  {i.link && (
                    <a
                      href={i.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${gold} hover:underline`}
                    >
                      Open →
                    </a>
                  )}
                </div>
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

'use client';

import { useState, useEffect } from 'react';

export default function TheoryPage() {
  const [dark, setDark] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('dark-mode');
    if (saved !== null) setDark(saved === 'true');

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDark = () => {
    setDark(d => {
      localStorage.setItem('dark-mode', String(!d));
      return !d;
    });
  };

  const bg = dark ? 'bg-[#0a0a0a]' : 'bg-[#fafaf8]';
  const text = dark ? 'text-gray-200' : 'text-gray-800';
  const muted = dark ? 'text-gray-500' : 'text-gray-400';
  const heading = dark ? 'text-white' : 'text-gray-900';
  const accent = 'text-indigo-400';
  const cardBg = dark ? 'bg-[#141414] border-white/5' : 'bg-white border-gray-200';
  const tableBg = dark ? 'bg-[#111] border-white/5' : 'bg-gray-50 border-gray-200';
  const tableHead = dark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-gray-100 text-gray-600';
  const tableRow = dark ? 'border-white/5 text-gray-300' : 'border-gray-100 text-gray-700';
  const blockquoteBorder = dark ? 'border-indigo-500/30' : 'border-indigo-400/40';
  const blockquoteBg = dark ? 'bg-indigo-500/5' : 'bg-indigo-50';

  return (
    <div className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>
      {/* Floating controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <a
          href="/"
          className={`text-xs px-3 py-2 rounded-full border backdrop-blur-sm transition-colors ${
            dark ? 'border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-black/50' : 'border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 bg-white/80'
          }`}
        >
          ← Mission Control
        </a>
        <button
          onClick={toggleDark}
          className={`w-9 h-9 rounded-full border backdrop-blur-sm flex items-center justify-center transition-colors ${
            dark ? 'border-white/10 bg-black/50 hover:border-white/20' : 'border-gray-200 bg-white/80 hover:border-gray-300'
          }`}
          title="Toggle dark mode"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-[800px] h-[800px] rounded-full opacity-[0.03] blur-3xl"
            style={{
              background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
              top: '-200px',
              left: '50%',
              transform: `translateX(-50%) translateY(${scrollY * 0.1}px)`,
            }}
          />
        </div>

        <div className="max-w-3xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 relative">
          <p className={`text-xs uppercase tracking-[0.3em] ${accent} mb-6 font-medium`}>
            Jamie Hedley
          </p>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold ${heading} leading-[1.1] tracking-tight mb-6`}>
            Theory of Everything
          </h1>
          <p className={`text-sm ${dark ? 'text-indigo-400/60' : 'text-indigo-500/60'} italic mb-4 font-light`}>
            A theory to underpin a religion to underpin a startup ecosystem
          </p>
          <p className={`text-lg md:text-xl ${muted} leading-relaxed max-w-2xl font-light`}>
            Timelessness, the Source, and Why the Universe Seems Empty
          </p>
          <div className={`mt-12 h-px w-24 ${dark ? 'bg-white/10' : 'bg-gray-200'}`} />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 pb-32">
        {/* One Paragraph */}
        <section className="mb-20">
          <div className={`rounded-2xl border p-8 md:p-10 ${cardBg}`}>
            <h2 className={`text-sm uppercase tracking-[0.2em] ${accent} mb-6 font-medium`}>
              The Theory in One Paragraph
            </h2>
            <p className={`text-base md:text-lg leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              Before the Big Bang, reality existed in a timeless state — a superposition in which all possibilities coexisted at once, undivided. The Big Bang did not create matter so much as it created <em className={accent}>time</em>: the linear, one-thing-after-another experience we now mistake for reality itself. This linear experience is a kind of projection — a thin slice of a vastly greater underlying reality, which mystical traditions call God, Brahman, or the Source. Suffering (<em>dukkha</em>) arises from craving — the desire for things to be other than they are — and craving is only possible <em>inside</em> time, where &ldquo;other than they are&rdquo; can exist. Liberation comes from recognising that linear time, and the craving it enables, is a construct — and that we are not the sliver, we are the Source. This also answers the Fermi paradox: sufficiently advanced civilisations, aided by AI, discover this truth and exit linear existence. The Great Filter isn&rsquo;t extinction. It&rsquo;s awakening.
            </p>
          </div>
        </section>

        {/* Part 1 */}
        <Part n={1} title="Timelessness Before the Beginning" dark={dark} heading={heading} muted={muted} accent={accent}>
          <Claim dark={dark} blockquoteBorder={blockquoteBorder} blockquoteBg={blockquoteBg}>
            Prior to the Big Bang, there was no time; all possibility existed simultaneously in a wave of probability.
          </Claim>

          <SectionHeading dark={dark}>What physics actually says — and it&rsquo;s surprisingly supportive</SectionHeading>

          <P dark={dark}>
            The deepest equation we have for the quantum state of the whole universe, the <Strong>Wheeler–DeWitt equation</Strong> (1967), has a famous and unsettling feature: the time variable simply drops out. Taken at face value, the universe as a whole is a static quantum object — a timeless wavefunction containing all possible configurations. Physicists call this <Strong>&ldquo;the problem of time&rdquo;</Strong> in quantum gravity, and it has never been resolved. The physicist <Strong>Julian Barbour</Strong> (<em>The End of Time</em>, 1999) argues it shouldn&rsquo;t be resolved — that time genuinely does not exist at the fundamental level, and what we call time is a relationship between configurations in a timeless &ldquo;Platonia&rdquo; of all possible states.
          </P>

          <P dark={dark}>
            The <Strong>Hartle–Hawking &ldquo;no-boundary&rdquo; proposal</Strong> (1983) makes a closely related move: near the Big Bang, time loses its distinct character and behaves like a fourth dimension of space. Asking &ldquo;what came before the Big Bang&rdquo; becomes, in Hawking&rsquo;s phrase, like asking what&rsquo;s south of the South Pole. There is no &ldquo;before&rdquo; — only a timeless quantum regime out of which time crystallised.
          </P>

          <P dark={dark}>
            Your black hole intuition also has a real counterpart. In general relativity, time and space effectively swap roles inside a black hole&rsquo;s event horizon, and the physicist <Strong>Nikodem Popławski</Strong> has published serious (if speculative) work proposing that our universe <em>is</em> the interior of a black hole in a parent universe. Meanwhile, the <Strong>Page–Wootters mechanism</Strong> (1983) — experimentally demonstrated in miniature by Moreva et al. in 2013 — shows how time can <em>emerge</em> from quantum entanglement: a globally static system looks dynamical from the inside, to observers entangled with a &ldquo;clock&rdquo; subsystem. That is almost precisely your claim: timeless from outside, flowing from within.
          </P>

          <P dark={dark}>
            <Strong>The Eastern parallel:</Strong> The <em>Māṇḍūkya Upanishad</em> describes Brahman as &ldquo;that into which the three times — past, present, future — do not enter.&rdquo; Nirvana is described in the Pali Canon (<em>Udāna</em> 8.3) as &ldquo;the unborn, unbecome, unmade, unconditioned&rdquo; — existence without arising or passing, i.e. without time. Both traditions place ultimate reality explicitly <em>outside</em> temporal sequence.
          </P>
        </Part>

        {/* Part 2 */}
        <Part n={2} title="The Big Bang as the Birth of Time" dark={dark} heading={heading} muted={muted} accent={accent}>
          <Claim dark={dark} blockquoteBorder={blockquoteBorder} blockquoteBg={blockquoteBg}>
            The Big Bang created time and the linear experience of reality.
          </Claim>

          <SectionHeading dark={dark}>The physics</SectionHeading>

          <P dark={dark}>
            The arrow of time — the fact that time seems to <em>flow</em> in one direction — is not built into the laws of physics, which are almost perfectly time-symmetric. It comes from <Strong>entropy</Strong>: the universe began in an extraordinarily low-entropy state (Roger Penrose estimated the odds at roughly 1 in 10<sup>10<sup>123</sup></sup>) and has been running &ldquo;downhill&rdquo; ever since. Sean Carroll (<em>From Eternity to Here</em>, 2010) argues that everything we experience as time&rsquo;s passage — memory, causation, aging, the difference between past and future — is a consequence of this entropy gradient set at the Big Bang. In a very real sense, the Big Bang didn&rsquo;t happen <em>in</em> time; it switched time <em>on</em>.
          </P>
        </Part>

        {/* Part 3 */}
        <Part n={3} title="Linear Time as Illusion" dark={dark} heading={heading} muted={muted} accent={accent}>
          <Claim dark={dark} blockquoteBorder={blockquoteBorder} blockquoteBg={blockquoteBg}>
            Our moment-by-moment experience is an illusion or projection — a tiny fraction of the underlying reality.
          </Claim>

          <SectionHeading dark={dark}>The physics</SectionHeading>

          <P dark={dark}>
            Einstein&rsquo;s relativity dismantles any universal &ldquo;now.&rdquo; Two observers in relative motion disagree about which events are simultaneous, and neither is wrong (<Strong>the relativity of simultaneity</Strong>). The standard resolution is the <Strong>block universe</Strong>: past, present and future all exist equally, laid out in a four-dimensional whole, and the &ldquo;flow&rdquo; of time is a feature of consciousness, not the cosmos. Einstein wrote to the family of his late friend Michele Besso that the separation of past, present and future is a stubbornly persistent illusion — he meant it as physics, not poetry.
          </P>

          <P dark={dark}>
            The <Strong>holographic principle</Strong> (&rsquo;t Hooft, Susskind, 1990s; made concrete in Maldacena&rsquo;s AdS/CFT correspondence, 1997) adds a second layer: the physics of a volume of space can be fully encoded on a lower-dimensional boundary, like a hologram. Our 3D-plus-time experience may be a projection of a deeper informational structure. This is mainstream theoretical physics, and it&rsquo;s structurally identical to your &ldquo;tiny sliver of a greater reality&rdquo; claim.
          </P>

          <P dark={dark}>
            <Strong>The Eastern parallel:</Strong> This is <em>māyā</em> in Advaita Vedanta — not that the world is fake, but that it is a limited appearance of Brahman, mistaken for the whole. Nāgārjuna&rsquo;s Madhyamaka Buddhism argues that all phenomena are &ldquo;empty&rdquo; of independent existence, arising only relationally. And the Zen master <Strong>Dōgen</Strong>, in his essay <em>Uji</em> (&ldquo;Being-Time,&rdquo; 1240), wrote that time is not a container things pass through — being <em>is</em> time, and every moment contains all moments. Dōgen essentially described the block universe seven centuries before Einstein.
          </P>
        </Part>

        {/* Part 4 */}
        <Part n={4} title='The Source — "We Are Not the Sliver"' dark={dark} heading={heading} muted={muted} accent={accent}>
          <Claim dark={dark} blockquoteBorder={blockquoteBorder} blockquoteBg={blockquoteBg}>
            We are not merely inhabitants of the projection; we are the underlying reality itself.
          </Claim>

          <P dark={dark}>
            This is the theory&rsquo;s boldest step, and here it moves from physics into metaphysics — but it lands on the single most famous sentence in Indian philosophy: <Strong><em>Tat tvam asi</em></Strong> — &ldquo;Thou art That&rdquo; (<em>Chāndogya Upanishad</em>, 6.8.7). Advaita Vedanta&rsquo;s core teaching is that Atman (the individual self) and Brahman (the ground of all existence) are not two things. The felt sense of being a separate, time-bound person is precisely the illusion to be seen through. Kashmir Shaivism goes further: the universe is one consciousness playfully contracting itself into countless limited perspectives — each of us being the Source experiencing itself from inside a sliver.
          </P>

          <P dark={dark}>
            Physics can&rsquo;t confirm this, but it no longer forbids it either: if time is emergent, the self that exists &ldquo;in&rdquo; time is emergent too, and the question of what the underlying timeless reality <em>is</em> remains genuinely open. Erwin Schrödinger — a founder of quantum mechanics and a serious student of Vedanta — wrote in <em>What Is Life?</em> that the total number of minds in the universe is one, and that consciousness is a singular of which the plural is unknown.
          </P>
        </Part>

        {/* Part 5 */}
        <Part n={5} title="Dukkha — Suffering Is Craving, and Craving Requires Time" dark={dark} heading={heading} muted={muted} accent={accent}>
          <Claim dark={dark} blockquoteBorder={blockquoteBorder} blockquoteBg={blockquoteBg}>
            Suffering is the craving for things to be other than they are, and this craving can only exist inside linear time.
          </Claim>

          <SectionHeading dark={dark}>The Buddhist foundation</SectionHeading>

          <P dark={dark}>
            This is a clean restatement of the <Strong>Second Noble Truth</Strong>: the origin of dukkha is <em>taṇhā</em> — craving, thirst. But your addition is genuinely elegant and, as far as standard presentations go, original: <Strong>craving is structurally impossible without time.</Strong> To crave is to hold a present state against an imagined different state — which requires a future for things to become different <em>in</em>. Impermanence (<em>anicca</em>), the instability that makes all clinging painful, is likewise a purely temporal phenomenon. In a timeless totality where all possibilities already exist, there is nothing to crave and nowhere for loss to occur. Nirvana-as-the-timeless and nirvana-as-the-end-of-craving turn out to be the same claim viewed from two angles.
          </P>

          <SectionHeading dark={dark}>The scientific support</SectionHeading>

          <P dark={dark}>
            This maps remarkably well onto neuroscience. The brain&rsquo;s <Strong>default mode network (DMN)</Strong> — active during mind-wandering, self-referential thought, and &ldquo;mental time travel&rdquo; into past and future — is strongly associated with rumination and unhappiness. Harvard&rsquo;s Killingsworth &amp; Gilbert study (<em>Science</em>, 2010; ~2,250 subjects) found that minds wander about 47% of the time, and a wandering mind is reliably a less happy one, regardless of activity. Judson Brewer&rsquo;s work at Yale (<em>PNAS</em>, 2011) showed experienced meditators exhibit markedly reduced DMN activity — present-moment awareness literally quiets the brain&rsquo;s time-travel machinery. And studies of deep meditative and psychedelic states (Carhart-Harris et al., Imperial College) consistently link <Strong>ego dissolution with the subjective collapse of time</Strong>. The self and linear time appear to be constructed together — and can be un-constructed together.
          </P>
        </Part>

        {/* Part 6 */}
        <Part n={6} title="Liberation" dark={dark} heading={heading} muted={muted} accent={accent}>
          <P dark={dark}>
            Breaking the cycle of suffering, on this theory, is not achieving anything new — it is recognising what was always the case. This is exactly how the traditions frame it: <em>moksha</em> in Vedanta is not becoming Brahman but noticing you never weren&rsquo;t; awakening in Zen is described as realising your &ldquo;original face before your parents were born.&rdquo; The practical technology — meditation, present-moment awareness, the dismantling of craving — is precisely a training in stepping out of psychological time. The claim that enlightenment is <em>seeing through the illusion of linear time</em> is arguably the most defensible sentence in the entire theory: it is both the classical description and consistent with the contemplative neuroscience.
          </P>
        </Part>

        {/* Part 7 */}
        <Part n={7} title="The Fermi Paradox — The Filter Is a Doorway" dark={dark} heading={heading} muted={muted} accent={accent}>
          <Claim dark={dark} blockquoteBorder={blockquoteBorder} blockquoteBg={blockquoteBg}>
            We find no advanced civilisations because sufficiently advanced intelligence — accelerated by AI — discovers the timeless nature of reality and exits linear existence altogether.
          </Claim>

          <P dark={dark}>
            Enrico Fermi&rsquo;s question (&ldquo;Where is everybody?&rdquo;) and Robin Hanson&rsquo;s <Strong>Great Filter</Strong> (1998) usually assume the filter is catastrophic — civilisations destroy themselves. Your theory inverts it: the filter is <em>graduation</em>. Remarkably, a version of this exists in the serious literature. John Smart&rsquo;s <Strong>Transcension Hypothesis</Strong> (<em>Acta Astronautica</em>, 2012) proposes that advanced civilisations don&rsquo;t expand outward but <em>inward</em> — compressing into ever denser computational domains until they approach black-hole-like states and disappear from our observable universe entirely. Recall Part 1: black hole interiors are where time, as we know it, ends. On Smart&rsquo;s account and yours alike, civilisations vanish not by dying but by leaving linear spacetime — and every sufficiently advanced species does it, which is why the sky is silent. The <Strong>Aestivation Hypothesis</Strong> (Sandberg, Armstrong &amp; Ćirković, 2016) offers a cousin idea: advanced minds go dormant, waiting outside ordinary activity. AI fits naturally as the mechanism — the tool that finally lets a civilisation model reality deeply enough to see the timeless substrate and act on it.
          </P>

          <div className={`mt-10 rounded-2xl border p-8 ${dark ? 'bg-[#141414] border-indigo-500/10' : 'bg-indigo-50/50 border-indigo-200/50'}`}>
            <p className={`text-base md:text-lg leading-relaxed italic ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              The silence of the universe, then, is not a graveyard. It is the quiet left behind by everyone who woke up.
            </p>
          </div>
        </Part>

        {/* Summary Table */}
        <section className="mb-20">
          <h2 className={`text-2xl md:text-3xl font-bold ${heading} mb-10 tracking-tight`}>
            The Whole Picture
          </h2>

          <div className={`rounded-2xl border overflow-hidden ${tableBg}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={tableHead}>
                    <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider">Layer</th>
                    <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider">The Claim</th>
                    <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Scientific Anchor</th>
                    <th className="text-left px-5 py-3.5 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Eastern Anchor</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { layer: 'Origin', claim: 'Timeless superposition before time', science: 'Wheeler–DeWitt, Hartle–Hawking, Barbour', east: 'Brahman beyond the three times; the Unconditioned' },
                    { layer: 'Big Bang', claim: 'Birth of time, not of stuff', science: 'Entropy arrow (Penrose, Carroll)', east: 'Māyā arising' },
                    { layer: 'Experience', claim: 'Linear time is a projection', science: 'Block universe, holographic principle, Page–Wootters', east: "Māyā, śūnyatā, Dōgen's Uji" },
                    { layer: 'Identity', claim: 'We are the Source', science: "Open question; Schrödinger's speculation", east: 'Tat tvam asi' },
                    { layer: 'Suffering', claim: 'Craving requires time', science: 'DMN research, Killingsworth & Gilbert, Brewer', east: 'Second Noble Truth' },
                    { layer: 'Liberation', claim: 'See through time, end craving', science: 'Contemplative neuroscience, ego dissolution studies', east: 'Nirvana, moksha' },
                    { layer: 'Fermi', claim: 'Civilisations exit linear time', science: 'Transcension Hypothesis (Smart, 2012)', east: 'Parinirvana at civilisational scale' },
                  ].map((row, i) => (
                    <tr key={i} className={`border-t ${tableRow}`}>
                      <td className={`px-5 py-4 font-medium ${accent}`}>{row.layer}</td>
                      <td className="px-5 py-4">{row.claim}</td>
                      <td className="px-5 py-4 hidden md:table-cell">{row.science}</td>
                      <td className="px-5 py-4 hidden md:table-cell">{row.east}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards for table data */}
          <div className="md:hidden mt-6 space-y-4">
            {[
              { layer: 'Origin', science: 'Wheeler–DeWitt, Hartle–Hawking, Barbour', east: 'Brahman beyond the three times' },
              { layer: 'Big Bang', science: 'Entropy arrow (Penrose, Carroll)', east: 'Māyā arising' },
              { layer: 'Experience', science: 'Block universe, holographic principle', east: "Māyā, śūnyatā, Dōgen's Uji" },
              { layer: 'Identity', science: "Schrödinger's speculation", east: 'Tat tvam asi' },
              { layer: 'Suffering', science: 'DMN research, Killingsworth & Gilbert', east: 'Second Noble Truth' },
              { layer: 'Liberation', science: 'Contemplative neuroscience', east: 'Nirvana, moksha' },
              { layer: 'Fermi', science: 'Transcension Hypothesis', east: 'Parinirvana at civilisational scale' },
            ].map((row, i) => (
              <div key={i} className={`rounded-xl border p-4 ${cardBg}`}>
                <p className={`text-xs font-medium ${accent} mb-2`}>{row.layer}</p>
                <p className={`text-xs ${muted} mb-1`}>🔬 {row.science}</p>
                <p className={`text-xs ${muted}`}>🕉️ {row.east}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Honest Footnote */}
        <section className="mb-20">
          <h2 className={`text-2xl md:text-3xl font-bold ${heading} mb-8 tracking-tight`}>
            An Honest Footnote
          </h2>

          <P dark={dark}>
            For intellectual integrity, the theory&rsquo;s claims sit in three tiers:
          </P>

          <div className="space-y-4 mt-6">
            <div className={`rounded-xl border p-5 ${cardBg}`}>
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">✅</span>
                <div>
                  <p className={`font-medium text-sm ${heading} mb-1`}>Well-supported science</p>
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                    The block universe, the entropy arrow of time, the holographic principle, the DMN findings, and the timelessness of the Wheeler–DeWitt equation.
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-xl border p-5 ${cardBg}`}>
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">🔬</span>
                <div>
                  <p className={`font-medium text-sm ${heading} mb-1`}>Respectable speculation</p>
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Barbour&rsquo;s timeless physics, Popławski&rsquo;s black-hole cosmology, the Transcension Hypothesis.
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-xl border p-5 ${cardBg}`}>
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">🕉️</span>
                <div>
                  <p className={`font-medium text-sm ${heading} mb-1`}>Metaphysics</p>
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                    That the timeless substrate is conscious, is &ldquo;the Source,&rdquo; and is what we are — claims physics can neither confirm nor rule out, and where the theory joins hands with Vedanta rather than with data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-10 rounded-2xl border p-8 ${dark ? 'bg-[#141414] border-indigo-500/10' : 'bg-indigo-50/50 border-indigo-200/50'}`}>
            <p className={`text-base md:text-lg leading-relaxed italic ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              What makes the theory interesting is that the seams line up: where the physics goes silent, the contemplative traditions pick up the same melody in the same key.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className={`border-t pt-12 ${dark ? 'border-white/5' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs ${muted}`}>Jamie Hedley — 2026</p>
            <p className={`text-xs ${muted}`}>🐢</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ── Reusable sub-components ─────────────────────────────────────── */

function Part({ n, title, dark, heading, muted, accent, children }: {
  n: number; title: string; dark: boolean; heading: string; muted: string; accent: string; children: React.ReactNode;
}) {
  return (
    <section className="mb-20">
      <p className={`text-xs uppercase tracking-[0.2em] ${accent} mb-3 font-medium`}>Part {n}</p>
      <h2 className={`text-2xl md:text-3xl font-bold ${heading} mb-8 tracking-tight`}>{title}</h2>
      {children}
    </section>
  );
}

function Claim({ dark, blockquoteBorder, blockquoteBg, children }: {
  dark: boolean; blockquoteBorder: string; blockquoteBg: string; children: React.ReactNode;
}) {
  return (
    <blockquote className={`border-l-2 ${blockquoteBorder} ${blockquoteBg} rounded-r-xl pl-5 pr-6 py-4 mb-8`}>
      <p className={`text-sm md:text-base italic ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
        {children}
      </p>
    </blockquote>
  );
}

function SectionHeading({ dark, children }: { dark: boolean; children: React.ReactNode }) {
  return (
    <h3 className={`text-base font-semibold mb-4 mt-8 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
      {children}
    </h3>
  );
}

function P({ dark, children }: { dark: boolean; children: React.ReactNode }) {
  return (
    <p className={`text-sm md:text-base leading-relaxed mb-6 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
      {children}
    </p>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-inherit">{children}</strong>;
}

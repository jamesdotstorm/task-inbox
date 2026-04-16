'use client';

interface Contact {
  name: string;
  phone: string;
  descriptor: string;
  redacted?: boolean;
}

const directContacts: Contact[] = [
  { name: 'Jamie', phone: '+27828679221', descriptor: 'Owner' },
  { name: 'Tarn Hedley', phone: '+27606716091', descriptor: "Jamie's wife" },
  { name: 'Peuge / Michael Kennedy', phone: '+27686941058', descriptor: 'Quicket co-founder' },
  { name: 'James Tagg', phone: '+27833018602', descriptor: 'Quicket co-founder' },
  { name: 'Laura Baasch', phone: '+27842002120', descriptor: 'Head of automation, Quicket' },
  { name: 'Nick Bush', phone: '+27741749902', descriptor: 'Yacht "Drifter"' },
  { name: 'Stephen Fienberg', phone: '+27833581848', descriptor: 'Critical, brilliant, strange' },
  { name: 'Sean Walpole', phone: '+27823727797', descriptor: 'Runs Rentaroom' },
  { name: 'Wesley Kriedemann', phone: '+27648996523', descriptor: 'Super yacht captain' },
  { name: 'Steve Linde', phone: '+27836084566', descriptor: 'Sells animal hides' },
  { name: 'Kuven', phone: '+27825628115', descriptor: 'Goes by "Magic"' },
  { name: 'Thomas van Alphen', phone: '+27608356924', descriptor: 'Owns Hout and About Guest House' },
  { name: 'Joanna', phone: '+27784307929', descriptor: "Jamie's sister" },
  { name: 'Unknown', phone: '+27832993761', descriptor: 'Redacted per POPIA', redacted: true },
  { name: 'Unknown', phone: '+27798580138', descriptor: 'Redacted per POPIA', redacted: true },
];

interface Props {
  dark: boolean;
}

export default function CommsView({ dark }: Props) {
  const card = dark
    ? 'bg-[#1a1a1a] border-white/8'
    : 'bg-white border-gray-200 shadow-sm';

  const subText = dark ? 'text-white/40' : 'text-gray-400';
  const nameText = dark ? 'text-white' : 'text-gray-900';
  const phoneText = dark ? 'text-white/50' : 'text-gray-500';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>📡 Comms</h1>
        <p className={`text-sm mt-1 ${subText}`}>
          How people reach Jamie — and who goes where
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Column 1: Direct to Torti */}
        <div>
          <div className={`border rounded-2xl overflow-hidden ${card}`}>
            {/* Column header */}
            <div className={`px-5 py-4 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
              <h2 className={`text-base font-bold ${nameText}`}>Direct to Torti 🐢</h2>
              <p className={`text-xs mt-0.5 ${subText}`}>
                These contacts message via WhatsApp — Torti handles them directly
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className={`text-xs font-medium text-green-400`}>WhatsApp allowlist · {directContacts.length} contacts</span>
              </div>
            </div>

            {/* Contact list */}
            <div className="divide-y divide-white/5">
              {directContacts.map((contact, i) => (
                <div key={i} className={`px-5 py-3 flex items-center justify-between gap-3 ${dark ? 'hover:bg-white/2' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar circle */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold ${
                      contact.redacted
                        ? dark ? 'bg-white/5 text-white/20' : 'bg-gray-100 text-gray-300'
                        : dark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {contact.redacted ? '?' : contact.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${contact.redacted ? (dark ? 'text-white/30' : 'text-gray-300') : nameText}`}>
                        {contact.name}
                      </p>
                      <p className={`text-xs truncate ${contact.redacted ? (dark ? 'text-white/20' : 'text-gray-200') : phoneText}`}>
                        {contact.redacted ? '••••••••••' : contact.phone}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    contact.redacted
                      ? dark ? 'bg-red-500/10 text-red-400/60' : 'bg-red-50 text-red-300'
                      : dark ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {contact.descriptor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Torti's Secretary */}
        <div>
          <div className={`border rounded-2xl overflow-hidden ${card}`}>
            {/* Column header */}
            <div className={`px-5 py-4 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
              <h2 className={`text-base font-bold ${nameText}`}>Torti's Secretary 📋</h2>
              <p className={`text-xs mt-0.5 ${subText}`}>
                Anyone who finds the Telegram bot gets routed here — requests are queued for Jamie
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className={`text-xs font-medium text-blue-400`}>Telegram bot · open to anyone</span>
              </div>
            </div>

            {/* Secretary explanation */}
            <div className={`px-5 py-5 space-y-4`}>
              <div className={`rounded-xl p-4 ${dark ? 'bg-blue-500/8 border border-blue-500/15' : 'bg-blue-50 border border-blue-100'}`}>
                <p className={`text-sm font-semibold mb-1 ${dark ? 'text-blue-300' : 'text-blue-700'}`}>🤖 How it works</p>
                <p className={`text-sm ${dark ? 'text-white/60' : 'text-gray-600'}`}>
                  Anyone who discovers the friends Telegram bot can send a message. Torti acts as a
                  friendly secretary — acknowledging contact, gathering context, and queuing audience
                  requests for Jamie to review.
                </p>
              </div>

              <div className={`rounded-xl p-4 ${dark ? 'bg-white/3 border border-white/6' : 'bg-gray-50 border border-gray-100'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${subText}`}>Typical routing flow</p>
                <div className="space-y-2">
                  {[
                    { step: '1', label: 'Person finds the Telegram bot', color: 'bg-indigo-500' },
                    { step: '2', label: 'Torti greets and gathers their request', color: 'bg-indigo-500' },
                    { step: '3', label: 'Request gets added to Task Inbox', color: 'bg-indigo-500' },
                    { step: '4', label: 'Jamie reviews and decides next step', color: 'bg-green-500' },
                  ].map(({ step, label, color }) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full ${color} text-white text-xs flex items-center justify-center flex-shrink-0 font-bold`}>
                        {step}
                      </span>
                      <p className={`text-sm ${dark ? 'text-white/60' : 'text-gray-600'}`}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-xl p-4 ${dark ? 'bg-yellow-500/8 border border-yellow-500/15' : 'bg-yellow-50 border border-yellow-100'}`}>
                <p className={`text-sm font-semibold mb-1 ${dark ? 'text-yellow-300' : 'text-yellow-700'}`}>📌 Note</p>
                <p className={`text-sm ${dark ? 'text-white/60' : 'text-gray-600'}`}>
                  The Secretary route is intentionally open — anyone with the bot link can reach Torti.
                  Jamie is not exposed directly. All audience requests are routed, reviewed, and
                  acted on at Jamie's discretion.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

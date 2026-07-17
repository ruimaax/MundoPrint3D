const INK = "#191430";

// Ilustraciones planas de cada producto, en la paleta de la marca. Se usan
// como imagen provisional hasta que haya foto real (campo image en products).
const art: Record<string, React.ReactNode> = {
  "funko-personalizado": (
    <>
      <circle className="art-bg" cx="100" cy="80" r="56" fill="#f3ebff" />
      <rect x="66" y="20" width="68" height="56" rx="16" fill="#e9d5ff" stroke={INK} strokeWidth="4" />
      <path d="M66 44 C66 22 82 14 100 14 C118 14 134 22 134 44 L134 34 C126 26 114 24 100 24 C86 24 74 26 66 34 Z" fill={INK} />
      <circle data-eye cx="85" cy="50" r="4.5" fill={INK} />
      <circle data-eye cx="115" cy="50" r="4.5" fill={INK} />
      <rect x="76" y="76" width="48" height="36" rx="12" fill="#6c4cff" stroke={INK} strokeWidth="4" />
      <rect x="80" y="112" width="16" height="22" rx="7" fill="#e9d5ff" stroke={INK} strokeWidth="4" />
      <rect x="104" y="112" width="16" height="22" rx="7" fill="#e9d5ff" stroke={INK} strokeWidth="4" />
      <path className="art-twinkle" d="M152 34 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 Z" fill="#ffb97a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </>
  ),
  "funko-seleccion": (
    <>
      <circle className="art-bg" cx="100" cy="80" r="56" fill="#fef3c7" />
      <rect x="66" y="20" width="68" height="56" rx="16" fill="#e9d5ff" stroke={INK} strokeWidth="4" />
      <path d="M66 40 C70 22 84 14 100 14 C116 14 130 22 134 40 C124 32 112 30 100 30 C88 30 76 32 66 40 Z" fill={INK} />
      <circle data-eye cx="85" cy="50" r="4.5" fill={INK} />
      <circle data-eye cx="115" cy="50" r="4.5" fill={INK} />
      <rect x="76" y="76" width="48" height="36" rx="12" fill="#ef4444" stroke={INK} strokeWidth="4" />
      <path d="M96 76 h8 v36 h-8 Z" fill="#ffb97a" />
      <rect x="76" y="76" width="48" height="36" rx="12" fill="none" stroke={INK} strokeWidth="4" />
      <rect x="80" y="112" width="16" height="20" rx="7" fill="#1d4ed8" stroke={INK} strokeWidth="4" />
      <rect x="104" y="112" width="16" height="20" rx="7" fill="#1d4ed8" stroke={INK} strokeWidth="4" />
      <circle cx="148" cy="122" r="15" fill="white" stroke={INK} strokeWidth="4" />
      <path d="M148 114 l7 5 -3 8 h-8 l-3 -8 Z" fill={INK} />
    </>
  ),
  "funko-semanasanta": (
    <>
      <circle className="art-bg" cx="100" cy="80" r="56" fill="#f3ebff" />
      <path d="M100 8 L127 78 L73 78 Z" fill="#6c4cff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="91" cy="64" r="5" fill="white" stroke={INK} strokeWidth="3" />
      <circle cx="109" cy="64" r="5" fill="white" stroke={INK} strokeWidth="3" />
      <circle data-eye cx="91" cy="64" r="2.2" fill={INK} />
      <circle data-eye cx="109" cy="64" r="2.2" fill={INK} />
      <path d="M73 78 h54 l8 56 h-70 Z" fill="#6c4cff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M73 96 h62" stroke={INK} strokeWidth="3" />
      <rect x="140" y="84" width="10" height="40" rx="3" fill="#fef3c7" stroke={INK} strokeWidth="3" />
      <path className="art-flame" d="M145 70 C150 76 149 82 145 84 C141 82 140 76 145 70 Z" fill="#ffb97a" stroke={INK} strokeWidth="3" />
    </>
  ),
  mascota: (
    <>
      <circle className="art-bg" cx="100" cy="78" r="52" fill="#ffedd5" />
      <rect x="62" y="36" width="76" height="64" rx="26" fill="#fcd34d" stroke={INK} strokeWidth="4" />
      <path d="M62 52 C50 46 46 60 52 72 C56 80 64 80 66 74 Z" fill="#b45309" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M138 52 C150 46 154 60 148 72 C144 80 136 80 134 74 Z" fill="#b45309" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle data-eye cx="85" cy="62" r="4.5" fill={INK} />
      <circle data-eye cx="115" cy="62" r="4.5" fill={INK} />
      <ellipse cx="100" cy="84" rx="16" ry="12" fill="white" stroke={INK} strokeWidth="3.5" />
      <circle cx="100" cy="80" r="4.5" fill={INK} />
      <path d="M100 85 v6 M100 91 c-3 4 -8 4 -10 1 M100 91 c3 4 8 4 10 1" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  rotulos: (
    <>
      <circle className="art-bg" cx="100" cy="78" r="52" fill="#f3ebff" />
      <g transform="rotate(-6 76 78)">
        <rect x="52" y="54" width="48" height="48" rx="10" fill="#c4b5fd" stroke={INK} strokeWidth="4" />
        <text x="76" y="88" textAnchor="middle" fontSize="30" fontWeight="800" fill={INK} fontFamily="inherit">3</text>
      </g>
      <g transform="rotate(6 126 84)">
        <rect x="102" y="60" width="48" height="48" rx="10" fill="#6c4cff" stroke={INK} strokeWidth="4" />
        <text x="126" y="94" textAnchor="middle" fontSize="30" fontWeight="800" fill="white" fontFamily="inherit">D</text>
      </g>
    </>
  ),
  llaveros: (
    <>
      <circle className="art-bg" cx="100" cy="78" r="52" fill="#fef3c7" />
      <circle cx="76" cy="52" r="15" fill="none" stroke={INK} strokeWidth="5" />
      <g transform="rotate(35 100 80)">
        <rect x="84" y="72" width="52" height="14" rx="7" fill="#ffb97a" stroke={INK} strokeWidth="4" />
        <rect x="126" y="84" width="8" height="12" fill="#ffb97a" stroke={INK} strokeWidth="3.5" />
        <rect x="112" y="84" width="8" height="8" fill="#ffb97a" stroke={INK} strokeWidth="3.5" />
      </g>
      <rect x="56" y="88" width="40" height="26" rx="8" fill="#ec4899" stroke={INK} strokeWidth="4" transform="rotate(-8 76 101)" />
    </>
  ),
  eventos: (
    <>
      <circle className="art-bg" cx="100" cy="80" r="52" fill="#fce7f3" />
      <rect x="70" y="72" width="60" height="46" rx="8" fill="#ec4899" stroke={INK} strokeWidth="4" />
      <rect x="63" y="56" width="74" height="20" rx="7" fill="#f9a8d4" stroke={INK} strokeWidth="4" />
      <path d="M96 56 h8 v62 h-8 Z" fill="#ffb97a" stroke={INK} strokeWidth="3" />
      <path d="M100 54 C88 40 74 46 80 54 Z M100 54 C112 40 126 46 120 54 Z" fill="#ffb97a" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
    </>
  ),
  deco: (
    <>
      <circle className="art-bg" cx="100" cy="80" r="52" fill="#dcfce7" />
      <rect x="88" y="42" width="24" height="46" rx="12" fill="#4ade80" stroke={INK} strokeWidth="4" />
      <path d="M88 62 C74 60 72 46 80 44 C88 42 90 52 88 62 Z" fill="#4ade80" stroke={INK} strokeWidth="4" />
      <path d="M74 88 h52 l-6 40 h-40 Z" fill="#fb923c" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M72 88 h56" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  medida: (
    <>
      <circle className="art-bg" cx="100" cy="80" r="52" fill="#e0f2fe" />
      <g transform="rotate(-40 100 80)">
        <path d="M100 44 a16 16 0 1 0 12 27 l-8 -8 v-11 l11 0 a16 16 0 0 0 -15 -8 Z" fill="#94a3b8" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <rect x="94" y="72" width="12" height="46" rx="6" fill="#94a3b8" stroke={INK} strokeWidth="4" />
      </g>
      <path d="M132 58 l10 -6 10 6 v12 l-10 6 -10 -6 Z" fill="#c4b5fd" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="142" cy="64" r="4" fill={INK} />
    </>
  ),
};

// Borde inferior real de cada dibujo (medido con getBBox). En modo plain se
// usa para que todos apoyen a la misma altura sobre la cinta.
const PLAIN_BOTTOM: Record<string, number> = {
  "funko-personalizado": 134,
  "funko-seleccion": 137,
  "funko-semanasanta": 134,
  mascota: 100,
  rotulos: 110,
  llaveros: 117,
  eventos: 118,
  deco: 128,
  medida: 119,
};

// Con plain se oculta el círculo de fondo y el dibujo baja hasta la línea
// y=140: queda suelto y apoyado sobre la cinta de producción.
export default function ProductArt({ id, plain }: { id: string; plain?: boolean }) {
  const content = art[id] ?? art["funko-personalizado"];
  return (
    <svg viewBox="0 0 200 156" role="img" aria-hidden className={`h-full w-full ${plain ? "art-plain" : ""}`}>
      {plain ? <g transform={`translate(0 ${140 - (PLAIN_BOTTOM[id] ?? 134)})`}>{content}</g> : content}
    </svg>
  );
}

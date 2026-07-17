// El funko que asoma sobre el footer. Decorativo y quieto, sin
// interacciones.
export default function Peeker() {
  return (
    <div className="pointer-events-none absolute -top-[49px] right-8 sm:right-16" aria-hidden>
      <svg viewBox="0 0 120 52" className="h-[52px] w-[120px]">
        <rect x="22" y="10" width="76" height="60" rx="18" fill="#e9d5ff" stroke="#191430" strokeWidth="4" />
        <path d="M22 34 C22 15 38 8 60 8 C82 8 98 15 98 34 C88 26 75 24 60 24 C45 24 32 26 22 34 Z" fill="#191430" />
        <circle cx="45" cy="41" r="5" fill="#191430" />
        <circle cx="75" cy="41" r="5" fill="#191430" />
        <rect x="8" y="44" width="18" height="10" rx="5" fill="#e9d5ff" stroke="#191430" strokeWidth="4" />
        <rect x="94" y="44" width="18" height="10" rx="5" fill="#e9d5ff" stroke="#191430" strokeWidth="4" />
      </svg>
    </div>
  );
}

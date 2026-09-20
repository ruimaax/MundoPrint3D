"use client";

import { createContext, useContext, useState } from "react";
import MiniFunko, { type FunkoVariant } from "./MiniFunko";

const INK = "#191430";

// Cada vuelta de impresión enseña una idea distinta y el funko que sale de ella.
// `title` es lo que dice el titular del hero mientras se imprime esa idea.
const IDEAS: { id: string; label: string; title: string; funko: FunkoVariant; photo: React.ReactNode }[] = [
  {
    id: "persona",
    title: "Tú",
    label: "Tú",
    funko: "gamer",
    photo: (
      <svg viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#bae6fd" />
        <circle cx="82" cy="18" r="9" fill="#fde68a" />
        <path d="M14 100 C16 78 30 70 50 70 C70 70 84 78 86 100 Z" fill="#14b8a6" stroke={INK} strokeWidth="2.5" />
        <rect x="44" y="58" width="12" height="14" fill="#f5c9a8" stroke={INK} strokeWidth="2.5" />
        <ellipse cx="50" cy="44" rx="17" ry="20" fill="#f5c9a8" stroke={INK} strokeWidth="2.5" />
        <path d="M33 42 C31 26 40 20 50 20 C60 20 69 26 67 42 C62 34 56 32 50 32 C44 32 38 34 33 42 Z" fill={INK} />
        <circle cx="44" cy="45" r="2.2" fill={INK} />
        <circle cx="56" cy="45" r="2.2" fill={INK} />
        <path d="M44 53 Q50 58 56 53" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M30 44 C30 16 70 16 70 44" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        <rect x="26" y="40" width="8" height="13" rx="3" fill="#14b8a6" stroke={INK} strokeWidth="2.5" />
        <rect x="66" y="40" width="8" height="13" rx="3" fill="#14b8a6" stroke={INK} strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: "perro",
    title: "Tu perro",
    label: "Tu perro",
    funko: "perro",
    photo: (
      <svg viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#bbf7d0" />
        <rect y="78" width="100" height="22" fill="#86efac" />
        <path d="M22 100 C24 80 36 72 50 72 C64 72 76 80 78 100 Z" fill="#fcd34d" stroke={INK} strokeWidth="2.5" />
        <rect x="26" y="26" width="48" height="44" rx="18" fill="#fcd34d" stroke={INK} strokeWidth="2.5" />
        <path d="M27 34 C15 30 12 44 17 54 C20 60 27 59 29 54 Z" fill="#b45309" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M73 34 C85 30 88 44 83 54 C80 60 73 59 71 54 Z" fill="#b45309" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="41" cy="42" r="2.6" fill={INK} />
        <circle cx="59" cy="42" r="2.6" fill={INK} />
        <ellipse cx="50" cy="56" rx="11" ry="8" fill="white" stroke={INK} strokeWidth="2.2" />
        <circle cx="50" cy="53" r="3.2" fill={INK} />
        <path d="M47 60 Q50 67 53 60" fill="#fb7185" stroke={INK} strokeWidth="1.8" />
        <rect x="38" y="70" width="24" height="5" rx="2.5" fill="#ef4444" stroke={INK} strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    id: "nazareno",
    title: "Tu nazareno",
    label: "Tu hermandad",
    funko: "nazareno",
    photo: (
      <svg viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#fde68a" />
        <rect y="80" width="100" height="20" fill="#e7c98a" />
        <path d="M24 100 L34 56 H66 L76 100 Z" fill="#6c4cff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M50 8 L70 60 H30 Z" fill="#6c4cff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <ellipse cx="44" cy="44" rx="3" ry="2" fill={INK} />
        <ellipse cx="56" cy="44" rx="3" ry="2" fill={INK} />
        <path d="M36 74 H64" stroke="#fff6ea" strokeWidth="2.5" />
        <rect x="74" y="50" width="5" height="40" rx="1.5" fill="#fff6ea" stroke={INK} strokeWidth="1.8" />
        <path d="M76.5 40 C73 45 74 49 76.5 50 C79 49 80 45 76.5 40 Z" fill="#fb923c" />
      </svg>
    ),
  },
  {
    id: "futbolista",
    title: "Tu jugador",
    label: "Tu jugador",
    funko: "futbolista",
    photo: (
      <svg viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#bae6fd" />
        <rect y="76" width="100" height="24" fill="#4ade80" />
        <path d="M18 100 C20 78 32 70 50 70 C68 70 80 78 82 100 Z" fill="#ef4444" stroke={INK} strokeWidth="2.5" />
        <rect x="45" y="70" width="10" height="30" fill="#ffb97a" />
        <rect x="44" y="58" width="12" height="14" fill="#f5c9a8" stroke={INK} strokeWidth="2.5" />
        <ellipse cx="50" cy="44" rx="17" ry="20" fill="#f5c9a8" stroke={INK} strokeWidth="2.5" />
        <path d="M33 42 C31 26 40 20 50 20 C60 20 69 26 67 42 C62 34 56 32 50 32 C44 32 38 34 33 42 Z" fill={INK} />
        <rect x="32" y="33" width="36" height="5" fill="#ffb97a" stroke={INK} strokeWidth="1.8" />
        <circle cx="44" cy="46" r="2.2" fill={INK} />
        <circle cx="56" cy="46" r="2.2" fill={INK} />
        <path d="M44 54 Q50 59 56 54" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="82" cy="86" r="9" fill="white" stroke={INK} strokeWidth="2.2" />
        <path d="M82 80 l4 3 -1.5 5 h-5 l-1.5 -5 Z" fill={INK} />
      </svg>
    ),
  },
];

// El titular del hero y la escena comparten la idea que se está imprimiendo.
const IdeaContext = createContext<{ idx: number; setIdx: React.Dispatch<React.SetStateAction<number>> }>({
  idx: 0,
  setIdx: () => {},
});

export function HeroIdeaProvider({ children }: { children: React.ReactNode }) {
  const [idx, setIdx] = useState(0);
  return <IdeaContext.Provider value={{ idx, setIdx }}>{children}</IdeaContext.Provider>;
}

// Titular que cambia con la idea: "Tú, hecho figura" → "Tu perro, hecho figura"…
export function HeroTitle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { idx } = useContext(IdeaContext);
  const idea = IDEAS[idx];
  return (
    <h1 className={className} style={style}>
      <span key={idea.id} className="hero-who">
        {idea.title},
      </span>
      <br />
      hecho figura
    </h1>
  );
}

// Escena del hero: la idea del cliente (una persona, su perro, un nazareno,
// un jugador…) → la impresora 3D imprime su funko capa a capa → el funko da
// un salto, pregunta si hacemos el tuyo y se retira; entonces cambia la idea
// y empieza la siguiente impresión desde cero. Cada vuelta es una animación
// CSS de una sola pasada; al acabar (animationend) pasamos a la siguiente
// idea y el `key` reinicia las piezas animadas. Con movimiento reducido no hay
// animación y se queda la primera idea ya impresa.
export default function PrintScene() {
  const { idx, setIdx } = useContext(IdeaContext);
  const idea = IDEAS[idx];

  const next = (e: React.AnimationEvent) => {
    if (e.animationName === "print-reveal" && e.target === e.currentTarget) {
      setIdx((i) => (i + 1) % IDEAS.length);
    }
  };

  return (
    <a href="#pedido" className="ps" aria-label="De tu idea a tu figura: pide la tuya">
      {/* la idea del cliente: va cambiando en cada vuelta */}
      <figure className="ps-photo">
        <span className="ps-pin" aria-hidden />
        <div key={idea.id} className="ps-slides ps-fade" aria-hidden>
          {idea.photo}
        </div>
        <figcaption>
          <strong>Tu idea</strong>
          <span key={idea.id} className="ps-sub ps-fade">
            {idea.label}
          </span>
        </figcaption>
      </figure>

      {/* flecha de la foto a la impresora */}
      <svg className="ps-arrow" viewBox="0 0 100 100" aria-hidden>
        <path d="M22 64 C22 86 32 90 41 84" fill="none" stroke={INK} strokeWidth="1.3" strokeDasharray="3 2.4" strokeLinecap="round" />
        <path d="M37.5 81.5 L42.5 83.5 L39.5 88" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* la impresora */}
      <div className="ps-printer" aria-hidden>
        <svg className="ps-spool" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="27" fill="#ff3d8b" stroke={INK} strokeWidth="4" />
          <circle cx="30" cy="30" r="17" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
          <circle cx="30" cy="30" r="9" fill="#fff6ea" stroke={INK} strokeWidth="4" />
          <path d="M30 3 V13 M30 47 V57 M3 30 H13 M47 30 H57" stroke={INK} strokeWidth="3" />
        </svg>

        <svg className="ps-frame" viewBox="0 0 300 340">
          <rect x="18" y="30" width="16" height="272" rx="4" fill={INK} />
          <rect x="266" y="30" width="16" height="272" rx="4" fill={INK} />
          <rect x="10" y="20" width="280" height="18" rx="7" fill={INK} />
          <rect x="46" y="280" width="208" height="14" rx="4" fill="#ffc400" stroke={INK} strokeWidth="4" />
          <rect x="4" y="294" width="292" height="42" rx="12" fill="#ff3b2e" stroke={INK} strokeWidth="4" />
          <rect x="96" y="303" width="108" height="24" rx="5" fill="#0d1a8a" stroke={INK} strokeWidth="3" />
          <circle cx="232" cy="315" r="7" fill="#10b981" stroke={INK} strokeWidth="3" />
        </svg>

        {/* piezas de cada vuelta: el key las reinicia con cada idea */}
        <svg key={`screen-${idx}`} className="ps-frame" viewBox="0 0 300 340">
          <text className="ps-screen ps-screen--busy" x="150" y="320" textAnchor="middle">IMPRIMIENDO…</text>
          <text className="ps-screen ps-screen--done" x="150" y="320" textAnchor="middle">¡HECHO!</text>
        </svg>

        <div key={`print-${idx}`} className="ps-print" onAnimationEnd={next}>
          <div className="ps-hop">
            <MiniFunko variant={idea.funko} className="block w-full" />
          </div>
        </div>

        <div key={`gantry-${idx}`} className="ps-gantry">
          <span className="ps-bar" />
          <svg className="ps-head" viewBox="0 0 60 40">
            <rect x="4" y="2" width="52" height="24" rx="6" fill="#ffc400" stroke={INK} strokeWidth="4" />
            <path d="M22 26 H38 L30 38 Z" fill={INK} />
            <circle className="ps-hot" cx="30" cy="38" r="3" fill="#ff3b2e" />
          </svg>
        </div>
      </div>

      <p key={`bubble-${idx}`} className="ps-bubble">
        ¡Listo! ¿Hacemos el tuyo?
      </p>
    </a>
  );
}

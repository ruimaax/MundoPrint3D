const INK = "#191430";

export type FunkoVariant =
  | "guia"
  | "obrero"
  | "fotografo"
  | "repartidor"
  | "artista"
  | "colgado"
  | "globo"
  | "heroe"
  | "futbolista"
  | "portero"
  | "nazareno"
  | "flamenca"
  | "gamer"
  | "argentino"
  | "perro";

const SHIRT: Record<FunkoVariant, string> = {
  guia: "#6c4cff",
  obrero: "#fb923c",
  fotografo: "#22c55e",
  repartidor: "#ec4899",
  artista: "#ffb97a",
  colgado: "#38bdf8",
  globo: "#a3e635",
  heroe: "#ef4444",
  futbolista: "#ef4444",
  portero: "#0ea5e9",
  nazareno: "#6c4cff",
  flamenca: "#ec4899",
  gamer: "#14b8a6",
  argentino: "#ffffff",
  perro: "#fcd34d",
};

// Mini funko mascota. Los ojos llevan data-eye para que FunkoEyes los haga
// seguir al cursor. Cada variante va vestida para su papel: "colgado" cuelga
// de las manos (para la marquesina) y "globo" flota agarrado a un globo.
export default function MiniFunko({ variant, className }: { variant: FunkoVariant; className?: string }) {
  const shirt = SHIRT[variant];
  const pointing = variant === "guia" || variant === "repartidor";
  const globo = variant === "globo";
  const colgado = variant === "colgado";

  // Superhéroe colgado boca abajo de un hilo (se dibuja invertido de fábrica).
  if (variant === "heroe") {
    return (
      <svg viewBox="0 0 120 130" className={className} aria-hidden>
        <line x1="60" y1="0" x2="60" y2="20" stroke={INK} strokeWidth="3" />
        <rect x="44" y="18" width="14" height="24" rx="6" fill="#1d4ed8" stroke={INK} strokeWidth="4" />
        <rect x="62" y="18" width="14" height="24" rx="6" fill="#1d4ed8" stroke={INK} strokeWidth="4" />
        <rect x="38" y="40" width="44" height="32" rx="10" fill="#ef4444" stroke={INK} strokeWidth="4" />
        <rect x="22" y="52" width="12" height="44" rx="6" fill="#ef4444" stroke={INK} strokeWidth="4" />
        <rect x="86" y="52" width="12" height="44" rx="6" fill="#ef4444" stroke={INK} strokeWidth="4" />
        <rect x="30" y="70" width="60" height="52" rx="14" fill="#ef4444" stroke={INK} strokeWidth="4" />
        <path d="M30 96 h60 M60 70 v52 M38 78 l44 36 M82 78 l-44 36" stroke={INK} strokeWidth="1.5" opacity="0.3" />
        <ellipse cx="47" cy="102" rx="9.5" ry="6.5" fill="white" stroke={INK} strokeWidth="3" transform="rotate(16 47 102)" />
        <ellipse cx="73" cy="102" rx="9.5" ry="6.5" fill="white" stroke={INK} strokeWidth="3" transform="rotate(-16 73 102)" />
      </svg>
    );
  }

  // Funko de perro: cabeza grande con orejas, cuerpo pequeño y rabo.
  if (variant === "perro") {
    return (
      <svg viewBox="0 0 120 132" className={className} aria-hidden>
        <ellipse cx="60" cy="126" rx="34" ry="5" fill="rgba(25,20,48,0.1)" />
        <rect x="42" y="102" width="14" height="24" rx="6" fill="#fcd34d" stroke={INK} strokeWidth="4" />
        <rect x="64" y="102" width="14" height="24" rx="6" fill="#fcd34d" stroke={INK} strokeWidth="4" />
        <rect x="86" y="74" width="26" height="11" rx="5.5" fill="#fcd34d" stroke={INK} strokeWidth="4" transform="rotate(-35 90 82)" />
        <rect x="36" y="78" width="48" height="30" rx="12" fill="#fcd34d" stroke={INK} strokeWidth="4" />
        <circle cx="70" cy="93" r="6" fill="#b45309" opacity="0.5" />
        <rect x="24" y="14" width="72" height="62" rx="24" fill="#fcd34d" stroke={INK} strokeWidth="4" />
        <path d="M25 32 C13 26 9 40 15 52 C19 60 27 60 29 54 Z" fill="#b45309" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M95 32 C107 26 111 40 105 52 C101 60 93 60 91 54 Z" fill="#b45309" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <circle data-eye cx="46" cy="41" r="4.5" fill={INK} />
        <circle data-eye cx="74" cy="41" r="4.5" fill={INK} />
        <ellipse cx="60" cy="59" rx="15" ry="11" fill="white" stroke={INK} strokeWidth="3.5" />
        <circle cx="60" cy="55" r="4.5" fill={INK} />
        <path d="M60 60 v5 M60 65 c-3 4 -8 4 -9 1 M60 65 c3 4 8 4 9 1" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  const viewBox = globo ? "0 0 120 196" : colgado ? "0 0 120 136" : "0 0 120 132";
  const shiftY = globo ? 64 : colgado ? 4 : 0;

  return (
    <svg viewBox={viewBox} className={className} aria-hidden>
      {globo ? (
        <>
          <ellipse cx="38" cy="34" rx="19" ry="22" fill="#ec4899" stroke={INK} strokeWidth="4" />
          <path d="M38 56 l-5 7 h10 Z" fill={INK} />
          <path d="M38 63 C34 86 30 100 32 122" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </>
      ) : null}

      <g transform={`translate(0 ${shiftY})`}>
        {!globo && !colgado ? <ellipse cx="60" cy="126" rx="34" ry="5" fill="rgba(43,27,61,0.1)" /> : null}

        {/* piernas */}
        <rect x="44" y="102" width="14" height="24" rx="6" fill="#c4b5fd" stroke={INK} strokeWidth="4" />
        <rect x="62" y="102" width="14" height="24" rx="6" fill="#c4b5fd" stroke={INK} strokeWidth="4" />

        {/* brazos */}
        {colgado ? (
          <>
            <rect x="19" y="0" width="11" height="84" rx="5" fill={shirt} stroke={INK} strokeWidth="4" />
            <rect x="90" y="0" width="11" height="84" rx="5" fill={shirt} stroke={INK} strokeWidth="4" />
          </>
        ) : (
          <>
            {globo ? (
              <rect x="26" y="54" width="12" height="28" rx="6" fill={shirt} stroke={INK} strokeWidth="4" />
            ) : (
              <rect x="26" y="80" width="12" height="26" rx="6" fill={shirt} stroke={INK} strokeWidth="4" />
            )}
            {pointing ? (
              <rect x="78" y="80" width="30" height="12" rx="6" fill={shirt} stroke={INK} strokeWidth="4" />
            ) : (
              <rect x="82" y="80" width="12" height="26" rx="6" fill={shirt} stroke={INK} strokeWidth="4" />
            )}
          </>
        )}

        {/* cuerpo */}
        <rect x="38" y="76" width="44" height="32" rx="10" fill={shirt} />
        {variant === "futbolista" ? <rect x="54" y="76" width="12" height="32" fill="#ffb97a" /> : null}
        {variant === "argentino" ? (
          <>
            <rect x="44" y="76" width="9" height="32" fill="#7dd3fc" />
            <rect x="59" y="76" width="9" height="32" fill="#7dd3fc" />
            <rect x="74" y="76" width="8" height="32" fill="#7dd3fc" />
          </>
        ) : null}
        <rect x="38" y="76" width="44" height="32" rx="10" fill="none" stroke={INK} strokeWidth="4" />

        {/* túnica de nazareno */}
        {variant === "nazareno" ? (
          <path d="M36 78 h48 l8 48 h-64 Z" fill={shirt} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        ) : null}

        {/* vestido de flamenca */}
        {variant === "flamenca" ? (
          <>
            <path d="M38 78 h44 l12 48 h-68 Z" fill={shirt} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            {[
              [48, 95],
              [66, 90],
              [56, 110],
              [44, 118],
              [74, 112],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill="white" />
            ))}
          </>
        ) : null}

        {/* guantes de portero */}
        {variant === "portero" ? (
          <>
            <rect x="22" y="98" width="19" height="14" rx="6" fill="#facc15" stroke={INK} strokeWidth="4" />
            <rect x="79" y="98" width="19" height="14" rx="6" fill="#facc15" stroke={INK} strokeWidth="4" />
          </>
        ) : null}

        {/* cabeza */}
        <rect x="30" y="16" width="60" height="52" rx="14" fill="#e9d5ff" stroke={INK} strokeWidth="4" />

        {/* pelo o sombrero */}
        {variant === "obrero" ? (
          <>
            <path d="M34 32 C34 17 45 9 60 9 C75 9 86 17 86 32 Z" fill="#ffb97a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <rect x="27" y="29" width="66" height="8" rx="4" fill="#ffb97a" stroke={INK} strokeWidth="3.5" />
          </>
        ) : variant === "repartidor" ? (
          <>
            <path d="M32 32 C32 18 44 10 60 10 C76 10 88 18 88 32 Z" fill="#6c4cff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <rect x="72" y="27" width="26" height="7" rx="3.5" fill="#6c4cff" stroke={INK} strokeWidth="3.5" />
          </>
        ) : variant === "artista" ? (
          <>
            <ellipse cx="58" cy="17" rx="28" ry="11" fill="#ec4899" stroke={INK} strokeWidth="4" />
            <rect x="54" y="2" width="8" height="8" rx="3.5" fill={INK} />
          </>
        ) : variant === "nazareno" ? (
          <path d="M60 1 L93 45 L27 45 Z" fill={shirt} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        ) : (
          <>
            <path d="M30 38 C30 20 42 12 60 12 C78 12 90 20 90 38 C82 30 72 28 60 28 C48 28 38 30 30 38 Z" fill={INK} />
            {variant === "futbolista" ? (
              <rect x="30" y="30" width="60" height="8" fill="#ffb97a" stroke={INK} strokeWidth="3" />
            ) : null}
          </>
        )}

        {/* ojos */}
        <circle data-eye cx="48" cy="46" r="4.5" fill={INK} />
        <circle data-eye cx="72" cy="46" r="4.5" fill={INK} />

        {/* accesorios */}
        {variant === "fotografo" ? (
          <>
            <rect x="42" y="80" width="36" height="24" rx="6" fill={INK} />
            <circle cx="60" cy="92" r="8" fill="#e9d5ff" stroke="#c4b5fd" strokeWidth="3" />
            <rect x="67" y="74" width="9" height="7" rx="2" fill="#ffb97a" stroke={INK} strokeWidth="3" />
          </>
        ) : null}
        {variant === "repartidor" ? (
          <>
            <rect x="86" y="84" width="27" height="23" rx="3" fill="#fcd34d" stroke={INK} strokeWidth="4" />
            <path d="M99.5 84 v23" stroke={INK} strokeWidth="3" />
          </>
        ) : null}
        {variant === "artista" ? (
          <g transform="rotate(14 95 84)">
            <rect x="91" y="70" width="8" height="24" rx="2.5" fill="#fb923c" stroke={INK} strokeWidth="3" />
            <path d="M95 98 l-4.5 -6 h9 Z" fill={INK} />
          </g>
        ) : null}
        {variant === "flamenca" ? (
          <>
            <circle cx="87" cy="21" r="7.5" fill="#ef4444" stroke={INK} strokeWidth="3" />
            <circle cx="87" cy="21" r="2.5" fill="#ffb97a" />
          </>
        ) : null}
        {variant === "gamer" ? (
          <>
            <path d="M27 32 C30 6 90 6 93 32" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
            <rect x="22" y="28" width="10" height="17" rx="4" fill={shirt} stroke={INK} strokeWidth="3.5" />
            <rect x="88" y="28" width="10" height="17" rx="4" fill={shirt} stroke={INK} strokeWidth="3.5" />
            <rect x="44" y="86" width="32" height="15" rx="7.5" fill={INK} />
            <circle cx="53" cy="93.5" r="2.2" fill="white" />
            <circle cx="67" cy="93.5" r="2.2" fill="white" />
          </>
        ) : null}
      </g>
    </svg>
  );
}

export function FunkoGuide({
  variant,
  flip,
  className,
  children,
  ...rest
}: {
  variant: FunkoVariant;
  flip?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`funko-guide ${flip ? "flip" : ""} ${className ?? ""}`} {...rest}>
      <MiniFunko variant={variant} className="funko-idle w-16 shrink-0 sm:w-20" />
      <p className="speech">{children}</p>
    </div>
  );
}

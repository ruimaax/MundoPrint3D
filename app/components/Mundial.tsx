const INK = "#191430";

type Team = {
  name: string;
  shirt: string;
  stripe: string;
  pants: string;
  hair?: string;
};

// Equipaciones de cada selección del cuadro.
const TEAMS: Record<string, Team> = {
  Francia: { name: "Francia", shirt: "#1e3a8a", stripe: "#1e3a8a", pants: "#ffffff" },
  Marruecos: { name: "Marruecos", shirt: "#c1272d", stripe: "#006233", pants: "#006233" },
  España: { name: "España", shirt: "#e11d2f", stripe: "#ffb800", pants: "#1e3a8a" },
  Bélgica: { name: "Bélgica", shirt: "#c8102e", stripe: "#111111", pants: "#111111", hair: "#facc15" },
  Inglaterra: { name: "Inglaterra", shirt: "#ffffff", stripe: "#e11d2f", pants: "#1e3a8a" },
  Noruega: { name: "Noruega", shirt: "#ba3733", stripe: "#00205b", pants: "#00205b", hair: "#facc15" },
  Argentina: { name: "Argentina", shirt: "#ffffff", stripe: "#75c7ec", pants: "#0f172a" },
  Suiza: { name: "Suiza", shirt: "#d52b1e", stripe: "#ffffff", pants: "#d52b1e" },
};

// Cuadro de la fase final: quién sale de cada llave.
const BRACKET = {
  leftQuarters: [
    ["Francia", "Marruecos"],
    ["España", "Bélgica"],
  ],
  leftSemi: ["Francia", "España"],
  rightQuarters: [
    ["Inglaterra", "Noruega"],
    ["Argentina", "Suiza"],
  ],
  rightSemi: ["Inglaterra", "Argentina"],
} as const;

function orderTeam(team: string) {
  const detail = `Quiero un funko del Mundial con la equipación de ${team}. Si os digo un jugador concreto, lo modeláis con su cara y su dorsal.`;
  return `/?idea=${encodeURIComponent("Funkos de la Selección")}&detalle=${encodeURIComponent(detail)}#encargo`;
}

function TeamFunko({ team }: { team: Team }) {
  return (
    <svg viewBox="0 0 120 132" className="w-full" aria-hidden>
      <ellipse cx="60" cy="126" rx="30" ry="4" fill="rgba(25,20,48,0.14)" />
      <rect x="44" y="102" width="14" height="24" rx="3" fill={team.pants} stroke={INK} strokeWidth="4" />
      <rect x="62" y="102" width="14" height="24" rx="3" fill={team.pants} stroke={INK} strokeWidth="4" />
      <rect x="26" y="80" width="12" height="26" rx="3" fill={team.shirt} stroke={INK} strokeWidth="4" />
      <rect x="82" y="80" width="12" height="26" rx="3" fill={team.shirt} stroke={INK} strokeWidth="4" />
      <rect x="38" y="76" width="44" height="32" rx="4" fill={team.shirt} />
      <rect x="56" y="76" width="9" height="32" fill={team.stripe} />
      <rect x="38" y="76" width="44" height="32" rx="4" fill="none" stroke={INK} strokeWidth="4" />
      <rect x="30" y="16" width="60" height="52" rx="6" fill="#e9d5ff" stroke={INK} strokeWidth="4" />
      <path
        d="M30 38 C30 20 42 12 60 12 C78 12 90 20 90 38 C82 30 72 28 60 28 C48 28 38 30 30 38 Z"
        fill={team.hair ?? INK}
        stroke={team.hair ? INK : "none"}
        strokeWidth={team.hair ? 3 : 0}
      />
      <circle data-eye cx="48" cy="46" r="4.5" fill={INK} />
      <circle data-eye cx="72" cy="46" r="4.5" fill={INK} />
      <circle cx="100" cy="118" r="11" fill="white" stroke={INK} strokeWidth="4" />
      <path d="M100 111.5 l5.5 4 -2.2 6.5 h-6.6 l-2.2 -6.5 Z" fill={INK} />
    </svg>
  );
}

// Una llave: dos selecciones enfrentadas. El que pasa lleva la marca.
function Match({
  pair,
  winner,
  size = "md",
}: {
  pair: readonly [string, string];
  winner?: string;
  size?: "md" | "lg";
}) {
  return (
    <div className={`match ${size === "lg" ? "is-lg" : ""}`}>
      {pair.map((name, index) => {
        const team = TEAMS[name];
        const decided = Boolean(winner);
        const passed = winner === name;
        return (
          <div key={name} className="contents">
            {index === 1 ? <span className="match-vs font-display">VS</span> : null}
            <a
              className={`team-slot ${!decided ? "is-pending" : passed ? "is-through" : "is-out"}`}
              href={orderTeam(name)}
              aria-label={`Pedir funko de ${name}`}
            >
              <span className="team-art">
                <TeamFunko team={team} />
              </span>
              <span className="team-name">{name}</span>
              {passed ? <span className="team-flag font-display">PASA</span> : null}
              <span className="team-cta">¡Lo quiero!</span>
            </a>
          </div>
        );
      })}
    </div>
  );
}

function Trophy() {
  return (
    <svg viewBox="0 0 120 150" className="w-28 sm:w-36" aria-hidden>
      <path d="M36 16 h48 v34 a24 24 0 0 1 -48 0 Z" fill="#ffb97a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M36 22 h-14 v10 a14 14 0 0 0 14 14 Z" fill="#ffb97a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M84 22 h14 v10 a14 14 0 0 1 -14 14 Z" fill="#ffb97a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="60" cy="38" r="13" fill="none" stroke={INK} strokeWidth="3" opacity="0.5" />
      <path d="M47 38 h26 M60 25 v26" stroke={INK} strokeWidth="2.5" opacity="0.4" />
      <rect x="52" y="74" width="16" height="20" fill="#ffb97a" stroke={INK} strokeWidth="4" />
      <rect x="34" y="94" width="52" height="14" rx="2" fill="#fcd34d" stroke={INK} strokeWidth="4" />
      <rect x="26" y="108" width="68" height="18" rx="2" fill="#1c8f4a" stroke={INK} strokeWidth="4" />
      <text x="60" y="121" textAnchor="middle" fontSize="9" fontWeight="800" fill="white" fontFamily="inherit">
        MUNDIAL
      </text>
    </svg>
  );
}

export default function Mundial() {
  return (
    <section id="mundial" className="stadium scroll-mt-24 px-5 py-16 text-white sm:px-8" data-reveal>
      <div className="stadium-stands" aria-hidden>
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="stadium-fan"
            style={{
              left: `${(i * 1.67) % 100}%`,
              top: `${8 + ((i * 37) % 3) * 14}px`,
              background: ["#6c4cff", "#ffb97a", "#3d7bff", "#ec4899", "#22c55e"][i % 5],
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span className="tag">Mundial 2026</span>
          <h2 className="font-display mt-4 text-balance text-4xl font-extrabold sm:text-5xl">
            Camino a la gloria
          </h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/75">
            La fase final en versión funko. Toca cualquier selección para pedir
            la tuya; si quieres un jugador concreto, dime cuál y lo modelo con
            su cara y su dorsal.
          </p>
        </div>

        <div className="bracket mt-12">
          <div className="bracket-side">
            <p className="round-label font-display">Cuartos</p>
            {BRACKET.leftQuarters.map((pair) => (
              <Match key={pair.join()} pair={pair} winner={pair[0]} />
            ))}
          </div>

          <div className="bracket-mid">
            <p className="round-label font-display">Semifinal</p>
            <Match pair={BRACKET.leftSemi} winner="España" />
          </div>

          <div className="bracket-final">
            <p className="round-label font-display">Final</p>
            <Trophy />
            <p className="mt-3 font-display text-lg font-extrabold">España – Argentina</p>
            <p className="mt-1 text-sm text-white/60">La gran final, por jugar.</p>
            <a className="btn-pop btn-sun mt-4" href="#encargo">
              Pedir mi funko del Mundial
            </a>
          </div>

          <div className="bracket-mid">
            <p className="round-label font-display">Semifinal</p>
            <Match pair={BRACKET.rightSemi} winner="Argentina" />
          </div>

          <div className="bracket-side">
            <p className="round-label font-display">Cuartos</p>
            {BRACKET.rightQuarters.map((pair) => (
              <Match key={pair.join()} pair={pair} winner={pair[1] === "Suiza" ? "Argentina" : pair[0]} />
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-white/60">
          ¿Tu selección no está en el cuadro? Pídela igual: se puede hacer
          cualquier equipación.
        </p>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import MiniFunko from "./MiniFunko";

const INK = "#191430";

const PELOS = ["Flequillo", "Rizos", "Coleta", "Capirote"] as const;

const CAMISETAS = [
  { id: "Morada", color: "#6c4cff" },
  { id: "La Roja", color: "#ef4444" },
  { id: "Verde", color: "#22c55e" },
  { id: "Rosa", color: "#ec4899" },
] as const;

const EXTRAS = ["Nada", "Balón", "Cirio", "Perrete"] as const;

type Pelo = (typeof PELOS)[number];
type Camiseta = (typeof CAMISETAS)[number];
type Extra = (typeof EXTRAS)[number];

function pick<T>(options: readonly T[], current: T): T {
  const others = options.filter((option) => option !== current);
  return others[Math.floor(Math.random() * others.length)];
}

export default function FunkoLab() {
  const [nombre, setNombre] = useState("");
  const [pelo, setPelo] = useState<Pelo>("Flequillo");
  const [camiseta, setCamiseta] = useState<Camiseta>(CAMISETAS[0]);
  const [extra, setExtra] = useState<Extra>("Nada");

  const stageRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<SVGSVGElement>(null);
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);

  // Los ojos del funko siguen al cursor.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const svg = figureRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height * 0.32;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(4.5, dist / 36);
        const x = ((dx / dist) * reach).toFixed(2);
        const y = ((dy / dist) * reach).toFixed(2);
        leftEyeRef.current?.setAttribute("transform", `translate(${x} ${y})`);
        rightEyeRef.current?.setAttribute("transform", `translate(${x} ${y})`);
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const burstConfetti = () => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#6c4cff", "#ffb97a", "#ec4899", "#c4b5fd", "#22c55e"];
    const { width, height } = stage.getBoundingClientRect();
    for (let i = 0; i < 26; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.background = colors[i % colors.length];
      piece.style.left = `${width / 2}px`;
      piece.style.top = `${height * 0.4}px`;
      stage.appendChild(piece);
      const angle = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 130;
      piece
        .animate(
          [
            { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
            {
              transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 90}px) rotate(${Math.random() * 720 - 360}deg)`,
              opacity: 0,
            },
          ],
          { duration: 750 + Math.random() * 500, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
        )
        .finished.then(() => piece.remove())
        .catch(() => piece.remove());
    }
  };

  const surprise = () => {
    setPelo(pick(PELOS, pelo));
    setCamiseta(pick(CAMISETAS, camiseta));
    setExtra(pick(EXTRAS, extra));
    burstConfetti();
  };

  const description = `Quiero un funko como el que he montado en la web: pelo ${pelo.toLowerCase()}, camiseta ${camiseta.id.toLowerCase()}${extra !== "Nada" ? ` y con ${extra.toLowerCase()}` : ""}${nombre.trim() ? `, con "${nombre.trim()}" en la peana` : ""}. Os paso una foto para que le pongáis mi cara.`;
  const orderHref = `/?idea=${encodeURIComponent("Funko personalizado")}&detalle=${encodeURIComponent(description)}#encargo`;

  const isSeleccion = camiseta.id === "La Roja";

  return (
    <div className="rounded-[6px] border-2 border-[#191430] bg-white p-5 shadow-[0_5px_0_#191430] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="tag -rotate-1">Configurador</span>
        <p className="text-xs font-bold text-[#191430]/50">Una muestra: tu cara la pongo yo</p>
      </div>

      <div ref={stageRef} className="relative mt-3 overflow-hidden rounded-[6px] bg-[#faf8ff]">
        <div className="stage-hang" aria-hidden>
          <MiniFunko variant="heroe" className="w-20" />
        </div>
        <div key={`${pelo}-${camiseta.id}-${extra}`} className="funko-pop">
          <svg ref={figureRef} viewBox="0 0 240 230" className="mx-auto block h-auto w-full max-w-72" role="img" aria-label={`Funko con pelo ${pelo}, camiseta ${camiseta.id} y extra ${extra}`}>
            <circle cx="120" cy="118" r="92" fill="#f3ebff" />
            {nombre.trim() ? (
              <g>
                <rect x="62" y="196" width="116" height="24" rx="3" fill="white" stroke={INK} strokeWidth="4" />
                <text x="120" y="213" textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily="inherit">
                  {nombre.trim().toUpperCase()}
                </text>
              </g>
            ) : (
              <ellipse cx="120" cy="208" rx="58" ry="8" fill="rgba(25,20,48,0.1)" />
            )}

            {/* piernas */}
            <rect x="94" y="168" width="22" height="36" rx="9" fill="#c4b5fd" stroke={INK} strokeWidth="5" />
            <rect x="124" y="168" width="22" height="36" rx="9" fill="#c4b5fd" stroke={INK} strokeWidth="5" />

            {/* brazos */}
            <rect x="62" y="122" width="20" height="42" rx="9" fill={camiseta.color} stroke={INK} strokeWidth="5" />
            <rect x="158" y="122" width="20" height="42" rx="9" fill={camiseta.color} stroke={INK} strokeWidth="5" />

            {/* cuerpo */}
            <rect x="82" y="114" width="76" height="58" rx="16" fill={camiseta.color} />
            {isSeleccion ? <rect x="112" y="114" width="16" height="58" fill="#ffb97a" /> : null}
            <rect x="82" y="114" width="76" height="58" rx="16" fill="none" stroke={INK} strokeWidth="5" />

            {/* cabeza */}
            <rect x="68" y="32" width="104" height="86" rx="24" fill="#e9d5ff" stroke={INK} strokeWidth="5" />

            {/* pelo */}
            {pelo === "Flequillo" ? (
              <path d="M68 58 C68 34 88 26 120 26 C152 26 172 34 172 58 C158 48 140 45 120 45 C100 45 82 48 68 58 Z" fill={INK} />
            ) : null}
            {pelo === "Rizos" ? (
              <>
                <circle cx="88" cy="36" r="15" fill={INK} />
                <circle cx="120" cy="28" r="16" fill={INK} />
                <circle cx="152" cy="36" r="15" fill={INK} />
              </>
            ) : null}
            {pelo === "Coleta" ? (
              <>
                <path d="M68 58 C68 34 88 26 120 26 C152 26 172 34 172 58 C158 48 140 45 120 45 C100 45 82 48 68 58 Z" fill={INK} />
                <circle cx="180" cy="42" r="13" fill={INK} />
                <rect x="166" y="40" width="10" height="8" rx="4" fill="#ffb97a" stroke={INK} strokeWidth="3" />
              </>
            ) : null}
            {pelo === "Capirote" ? (
              <path d="M120 -12 L164 46 L76 46 Z" fill="#6c4cff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            ) : null}

            {/* ojos */}
            <circle ref={leftEyeRef} cx="99" cy="78" r="7" fill={INK} />
            <circle ref={rightEyeRef} cx="141" cy="78" r="7" fill={INK} />

            {/* extras */}
            {extra === "Balón" ? (
              <>
                <circle cx="192" cy="192" r="19" fill="white" stroke={INK} strokeWidth="5" />
                <path d="M192 182 l9 6 -3.5 10 h-11 l-3.5 -10 Z" fill={INK} />
              </>
            ) : null}
            {extra === "Cirio" ? (
              <>
                <rect x="196" y="126" width="13" height="54" rx="4" fill="#fef3c7" stroke={INK} strokeWidth="4" />
                <path className="art-flame" d="M202.5 106 C209 114 208 122 202.5 125 C197 122 196 114 202.5 106 Z" fill="#ffb97a" stroke={INK} strokeWidth="3.5" />
              </>
            ) : null}
            {extra === "Perrete" ? (
              <>
                <rect x="24" y="164" width="46" height="40" rx="16" fill="#fcd34d" stroke={INK} strokeWidth="4.5" />
                <path d="M24 174 C14 170 12 182 18 190 C22 195 28 194 29 189 Z" fill="#b45309" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
                <path d="M70 174 C80 170 82 182 76 190 C72 195 66 194 65 189 Z" fill="#b45309" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
                <circle cx="39" cy="180" r="3.5" fill={INK} />
                <circle cx="55" cy="180" r="3.5" fill={INK} />
                <circle cx="47" cy="191" r="4" fill={INK} />
              </>
            ) : null}
          </svg>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 shrink-0 text-xs font-extrabold uppercase tracking-wide text-[#191430]/50">Pelo</span>
          {PELOS.map((option) => (
            <button key={option} type="button" className="chip" aria-pressed={pelo === option} onClick={() => setPelo(option)}>
              {option}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 shrink-0 text-xs font-extrabold uppercase tracking-wide text-[#191430]/50">Camiseta</span>
          {CAMISETAS.map((option) => (
            <button
              key={option.id}
              type="button"
              className="swatch"
              style={{ background: option.color }}
              aria-pressed={camiseta.id === option.id}
              aria-label={`Camiseta ${option.id}`}
              title={option.id}
              onClick={() => setCamiseta(option)}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 shrink-0 text-xs font-extrabold uppercase tracking-wide text-[#191430]/50">Extra</span>
          {EXTRAS.map((option) => (
            <button key={option} type="button" className="chip" aria-pressed={extra === option} onClick={() => setExtra(option)}>
              {option}
            </button>
          ))}
        </div>
        <label className="flex flex-wrap items-center gap-2">
          <span className="w-16 shrink-0 text-xs font-extrabold uppercase tracking-wide text-[#191430]/50">Peana</span>
          <input
            value={nombre}
            onChange={(event) => setNombre(event.target.value.slice(0, 12))}
            placeholder="Tu nombre aquí"
            aria-label="Nombre grabado en la peana"
            className="min-w-0 flex-1 rounded-[4px] border-2 border-[#191430]/25 bg-[#faf8ff] px-3 py-1.5 text-sm font-bold outline-none transition focus:border-[#6c4cff] focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="btn-pop btn-white !px-4 !py-2.5 text-sm" onClick={surprise}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="15.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="8.5" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
          </svg>
          Sorpréndeme
        </button>
        <a className="btn-pop btn-grape flex-1 !px-4 !py-2.5 text-sm" href={orderHref}>
          Pedir uno así
        </a>
      </div>
    </div>
  );
}

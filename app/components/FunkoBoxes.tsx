"use client";

import { PointerEvent, useRef, useState } from "react";
import { products } from "../data/products";
import MiniFunko, { FunkoVariant } from "./MiniFunko";
import ProductArt from "./ProductArt";

const INK = "#191430";

// Qué muñeco acompaña a cada producto estrella.
const VARIANT_BY_ID: Record<string, FunkoVariant> = {
  "funko-personalizado": "guia",
  mascota: "perro",
};

// La pieza que vive junto a cada caja: un funko, o el propio producto (los
// llaveros no son un muñeco).
function BoxMate({ productId, className }: { productId: string; className?: string }) {
  if (productId === "llaveros") {
    // El dibujo del llavero es más pequeño que un funko: se escala para que
    // no quede perdido al lado de la caja.
    return (
      <div className={className} style={{ transform: "scale(1.7)", transformOrigin: "70% 80%" }}>
        <ProductArt id="llaveros" plain />
      </div>
    );
  }
  return <MiniFunko variant={VARIANT_BY_ID[productId] ?? "guia"} className={className} />;
}

// Caja estilo vitrina de coleccionista, en perspectiva. Abierta enseña la
// solapa levantada; cerrada, la tapa plana con su precinto.
function BoxSvg({ closed }: { closed?: boolean }) {
  return (
    <svg viewBox="0 0 170 210" className="h-auto w-full" aria-hidden>
      {closed ? null : (
        <polygon points="18,26 40,-10 130,-10 152,26" fill="#f3ebff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      )}
      <polygon points="140,26 166,40 166,192 140,206" fill="#241536" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="8" y="26" width="132" height="180" rx="4" fill="white" stroke={INK} strokeWidth="4" />
      <rect x="16" y="34" width="116" height="164" rx="3" fill="#35204d" />
      <rect x="28" y="64" width="92" height="120" fill="#1c0f2e" stroke="white" strokeWidth="5" />
      <g transform="rotate(-8 42 50)">
        <ellipse cx="42" cy="50" rx="25" ry="13" fill="white" stroke={INK} strokeWidth="3" />
        <text x="42" y="55" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily="inherit">
          MP3D!
        </text>
      </g>
      <circle cx="112" cy="48" r="11" fill="#ffb97a" stroke={INK} strokeWidth="3" />
      <text x="112" y="53" textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily="inherit">
        ?
      </text>
      {closed ? (
        <>
          <polygon points="8,26 140,26 166,40 34,40" fill="white" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <polygon points="66,26 84,26 110,40 92,40" fill="#ffb97a" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </>
      ) : null}
    </svg>
  );
}

// Los tres productos estrella presentados como cajas de coleccionista: cada
// funko se puede arrastrar a su caja (se precinta sola) y sacar con un clic.
export default function FunkoBoxes() {
  const featured = products.filter((product) => product.featured);

  const [boxed, setBoxed] = useState(featured.map(() => false));
  const [offsets, setOffsets] = useState(featured.map(() => ({ x: 0, y: 0 })));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const drag = useRef<{ index: number; startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onPointerDown = (index: number) => (event: PointerEvent<HTMLElement>) => {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Sin captura el arrastre funciona igual mientras no se suelte fuera.
    }
    const base = offsets[index];
    drag.current = { index, startX: event.clientX, startY: event.clientY, baseX: base.x, baseY: base.y };
    setDragIndex(index);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = drag.current;
    if (!current) return;
    const x = current.baseX + event.clientX - current.startX;
    const y = current.baseY + event.clientY - current.startY;
    setOffsets((previous) => previous.map((offset, i) => (i === current.index ? { x, y } : offset)));
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const current = drag.current;
    drag.current = null;
    setDragIndex(null);
    if (!current) return;

    const box = boxRefs.current[current.index];
    const funkoRect = event.currentTarget.getBoundingClientRect();
    if (box) {
      const boxRect = box.getBoundingClientRect();
      const cx = funkoRect.left + funkoRect.width / 2;
      const cy = funkoRect.top + funkoRect.height / 2;
      if (cx > boxRect.left && cx < boxRect.right && cy > boxRect.top && cy < boxRect.bottom) {
        setBoxed((previous) => previous.map((value, i) => (i === current.index ? true : value)));
      }
    }
    setOffsets((previous) => previous.map((offset, i) => (i === current.index ? { x: 0, y: 0 } : offset)));
  };

  const unbox = (index: number) => {
    setBoxed((previous) => previous.map((value, i) => (i === index ? false : value)));
  };

  return (
    <div>
      <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
        {featured.map((product, index) => (
          <article
            key={product.id}
            className="flex flex-col"
            data-reveal
            style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
          >
            <div className="pack-station">
              {product.tagline ? <span className="tag absolute left-0 top-0 z-[3] -rotate-2">{product.tagline}</span> : null}

              <div
                className={`pack-box ${boxed[index] ? "is-closed" : ""}`}
                ref={(el) => { boxRefs.current[index] = el; }}
                role={boxed[index] ? "button" : undefined}
                tabIndex={boxed[index] ? 0 : undefined}
                aria-label={boxed[index] ? `Abrir la caja de ${product.title}` : undefined}
                onClick={boxed[index] ? () => unbox(index) : undefined}
                onKeyDown={
                  boxed[index]
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") unbox(index);
                      }
                    : undefined
                }
              >
                <div key={boxed[index] ? "cerrada" : "abierta"} className="funko-pop">
                  <BoxSvg closed={boxed[index]} />
                </div>
                {boxed[index] ? (
                  <div className="pack-funko-in pointer-events-none">
                    <BoxMate productId={product.id} className="h-auto w-full" />
                  </div>
                ) : null}
              </div>

              {!boxed[index] ? (
                <div
                  className={`pack-funko ${dragIndex === index ? "is-dragging" : ""}`}
                  role="button"
                  aria-label={`Arrastrar la pieza de ${product.title} a su caja`}
                  style={{
                    transform: `translate(${offsets[index].x}px, ${offsets[index].y}px)`,
                    transition: dragIndex === index ? "none" : "transform 200ms ease",
                  }}
                  onPointerDown={onPointerDown(index)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  <BoxMate productId={product.id} className="h-auto w-full" />
                </div>
              ) : null}
            </div>

            <h3 className="font-display mt-4 text-2xl font-bold leading-tight">{product.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-[#191430]/70">{product.description}</p>
            <a
              className="btn-pop btn-grape mt-4 self-start !px-5 !py-2 text-sm"
              href={`/?idea=${encodeURIComponent(product.title)}#encargo`}
            >
              Pedir el mío
            </a>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm font-bold text-[#191430]/45">
        Por cierto: puedes encajarlos. Arrastra cada pieza a su caja y se precinta sola; toca la caja para abrirla.
      </p>
    </div>
  );
}

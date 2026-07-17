"use client";

import { useState } from "react";
import { getHomeGallery, type GalleryItem } from "../data/gallery";
import MiniFunko from "./MiniFunko";

// Cada tarjeta enseña la figura terminada; si hay foto de referencia, al pasar
// el ratón (o tocar) se ve el "antes" que mandó el cliente.
export function GalleryPiece({ title, category, after, before, caption }: GalleryItem) {
  const [showBefore, setShowBefore] = useState(false);
  const hasBefore = Boolean(before);

  return (
    <figure className="gallery-card">
      <div
        className="gallery-art"
        onMouseEnter={() => setShowBefore(true)}
        onMouseLeave={() => setShowBefore(false)}
      >
        <img src={after} alt={title} loading="lazy" />
        {hasBefore ? (
          <>
            <img
              src={before}
              alt={`Foto de referencia de ${title}`}
              loading="lazy"
              className={`gallery-before ${showBefore ? "is-visible" : ""}`}
            />
            <button
              type="button"
              className="gallery-toggle"
              aria-pressed={showBefore}
              onClick={() => setShowBefore((value) => !value)}
            >
              {showBefore ? "Ver la figura" : "Ver la foto original"}
            </button>
          </>
        ) : null}
      </div>
      <figcaption className="p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-violet-700">{category}</p>
        <p className="font-display mt-1 text-lg font-bold leading-tight">{title}</p>
        {caption ? <p className="mt-1 text-sm leading-5 text-[#191430]/60">{caption}</p> : null}
      </figcaption>
    </figure>
  );
}

export default function Gallery() {
  const items = getHomeGallery();

  return (
    <section id="galeria" className="scroll-mt-24 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
          <div className="max-w-xl">
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Hecho en el taller</h2>
            <p className="mt-3 leading-7 text-[#191430]/70">
              Piezas reales que han salido de la impresora, cada una con su
              nombre y su historia.
            </p>
          </div>
          <div className="funko-guide">
            <MiniFunko variant="fotografo" className="funko-idle w-16 shrink-0 sm:w-20" />
            <p className="speech">Fotos de verdad, sin retoques raros.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
          {items.map((item) => (
            <GalleryPiece key={item.id} {...item} />
          ))}
        </div>

        <div className="mt-10 text-center" data-reveal>
          <a className="btn-pop btn-grape text-lg" href="/galeria">
            Ver todos los trabajos
          </a>
        </div>
      </div>
    </section>
  );
}

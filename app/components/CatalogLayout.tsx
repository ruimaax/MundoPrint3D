"use client";

import { useRef, useState, type PointerEvent } from "react";
import { TILE_SIZES, coverOf, sectionSpans, type Catalog, type TileSize } from "../data/catalog";

export default function CatalogLayout({ catalog, onChange }: { catalog: Catalog; onChange: (catalog: Catalog) => void }) {
  const drag = useRef<{ id: string; x: number; y: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const spans = sectionSpans(catalog.sections);

  const resize = (id: string, size: TileSize, feature = false) => {
    onChange({ sections: catalog.sections.map((section, i) => ({
      ...section,
      size: section.id === id ? size : feature && spans[i] === "big" ? "normal" : spans[i] || "normal",
    })) });
    setAnnouncement("Tamaño guardado");
  };

  const move = (id: string, to: number) => {
    const sections = [...catalog.sections];
    const from = sections.findIndex((section) => section.id === id);
    if (from < 0 || to < 0 || to >= sections.length || from === to) return;
    const [section] = sections.splice(from, 1);
    sections.splice(to, 0, section);
    // Los tamaños acompañan a las tarjetas cuando se cambia su posición.
    const sizes = new Map(catalog.sections.map((s, i) => [s.id, spans[i] || "normal"]));
    onChange({ sections: sections.map((s) => ({ ...s, size: sizes.get(s.id) as TileSize })) });
    setAnnouncement(`${section.title}, posición ${to + 1}`);
  };

  const hit = (event: PointerEvent) => document.elementFromPoint(event.clientX, event.clientY)
    ?.closest<HTMLElement>("[data-catalog-drop]")?.dataset.catalogDrop ?? null;

  const finish = (event: PointerEvent) => {
    const current = drag.current;
    const destination = hit(event);
    drag.current = null;
    setDragging(null);
    setTarget(null);
    if (!current?.moved || !destination) return;
    if (destination === "featured") resize(current.id, "big", true);
    else move(current.id, catalog.sections.findIndex((s) => s.id === destination));
  };

  return (
    <section className="mb-8 rounded-[22px] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-7" aria-labelledby="catalog-layout-title">
      <h2 id="catalog-layout-title" className="display text-2xl">Organiza el catálogo</h2>
      <p className="mt-2 text-sm font-medium text-toy-ink/70">Arrastra desde ⠿ para cambiar el orden. Suelta una tarjeta en «En grande» para destacarla o elige su tamaño. Se guarda automáticamente.</p>
      <div data-catalog-drop="featured" className={`my-5 rounded-2xl border-2 border-dashed p-5 text-center font-bold ${target === "featured" ? "border-toy-blue bg-toy-blue text-white" : "border-toy-blue/40 bg-toy-blue/5 text-toy-blue"}`}>
        ★ En grande · arrastra aquí la sección que quieras destacar
      </div>
      <div className="wall admin-wall">
        {catalog.sections.map((section, i) => (
          <article key={section.id} data-catalog-drop={section.id}
            className={`tile ${spans[i]} ${target === section.id && dragging !== section.id ? "ring-4 ring-toy-blue" : ""} ${dragging === section.id ? "opacity-50" : ""}`}
            style={{ background: section.color }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {coverOf(section) && <img src={coverOf(section)} alt="" draggable={false} className="pointer-events-none" />}
            <span className="veil pointer-events-none" />
            <button type="button" className="absolute left-2 top-2 z-10 rounded-xl bg-white px-3 py-2 font-bold text-toy-ink shadow-md focus-visible:ring-4 focus-visible:ring-toy-yellow"
              style={{ touchAction: "none", cursor: dragging ? "grabbing" : "grab" }}
              aria-label={`Mover ${section.title}. Usa las flechas para cambiar su posición.`}
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                drag.current = { id: section.id, x: event.clientX, y: event.clientY, moved: false };
              }}
              onPointerMove={(event) => {
                const current = drag.current;
                if (!current) return;
                if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 5) current.moved = true;
                if (current.moved) { setDragging(current.id); setTarget(hit(event)); }
                // Permite llegar a las tarjetas que quedan fuera de la pantalla.
                if (current.moved && event.clientY < 90) window.scrollBy(0, -18);
                if (current.moved && event.clientY > window.innerHeight - 90) window.scrollBy(0, 18);
              }}
              onPointerUp={finish}
              onPointerCancel={() => { drag.current = null; setDragging(null); setTarget(null); }}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); move(section.id, i - 1); }
                if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); move(section.id, i + 1); }
                if (event.key === "Escape") { drag.current = null; setDragging(null); setTarget(null); }
              }}>⠿ <span className="text-xs">{i + 1}</span></button>
            <div className="absolute inset-x-0 bottom-0 z-10 p-3 text-white">
              <h3 className="mb-2 text-sm font-extrabold sm:text-base">{section.title}</h3>
              <select aria-label={`Tamaño de ${section.title}`} value={spans[i] || "normal"}
                className="w-full rounded-lg bg-white p-2 text-xs font-bold text-toy-ink"
                onChange={(event) => resize(section.id, event.target.value as TileSize)}>
                {TILE_SIZES.map((size) => <option key={size.value} value={size.value}>{size.label}</option>)}
              </select>
            </div>
          </article>
        ))}
      </div>
      {!catalog.sections.length && <p className="mt-4 text-sm">Crea una sección para empezar a organizar el catálogo.</p>}
      <p role="status" className="sr-only">{announcement}</p>
    </section>
  );
}

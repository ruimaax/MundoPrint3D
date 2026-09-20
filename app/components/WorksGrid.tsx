"use client";

import { useMemo, useState } from "react";
import { allShots, homeShots, inkOn } from "../data/catalog";
import { useCatalog } from "../data/useCatalog";

// La vitrina: fotos reales de cada sección del catálogo (editables desde
// /admin). En portada sale una selección variada; en /galeria, todas con
// filtro por sección.
export default function WorksGrid({ filterable = false }: { filterable?: boolean }) {
  const catalog = useCatalog();
  const items = filterable ? allShots(catalog) : homeShots(catalog);

  const sections = useMemo(
    () => ["Todos", ...catalog.sections.filter((s) => s.photos.length > 0).map((s) => s.title)],
    [catalog],
  );
  const [active, setActive] = useState("Todos");

  const visible = active === "Todos" ? items : items.filter((i) => i.section === active);

  return (
    <div>
      {filterable && (
        <div className="mb-9 flex flex-wrap gap-2.5">
          {sections.map((title) => (
            <button
              key={title}
              type="button"
              className="chip"
              data-active={active === title}
              onClick={() => setActive(title)}
            >
              {title}
            </button>
          ))}
        </div>
      )}

      <div className="shots">
        {visible.map((item, i) => (
          <figure
            key={`${item.section}-${item.id}`}
            className="shot m-0"
            data-reveal="pop"
            style={{ "--i": i % 6 } as React.CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.title ? `${item.title} — ${item.section}` : item.section} loading="lazy" />
            <figcaption>
              <span className="name truncate">{item.title ?? item.section}</span>
              <span
                className="tagpill"
                style={{ "--pill": item.color, color: inkOn(item.color) } as React.CSSProperties}
              >
                {item.section}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

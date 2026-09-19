"use client";

import { useMemo, useState } from "react";
import type { GalleryItem } from "../data/gallery";

const PILL_COLORS = ["var(--blue)", "var(--red)", "var(--pink)", "var(--green)"];

function pillColor(category: string) {
  let hash = 0;
  for (const ch of category) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return PILL_COLORS[hash % PILL_COLORS.length];
}

// La vitrina: trabajos reales, foto limpia y grande, sin adornos.
export default function WorksGrid({
  items,
  filterable = false,
}: {
  items: GalleryItem[];
  filterable?: boolean;
}) {
  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );
  const [active, setActive] = useState("Todos");

  const visible =
    active === "Todos" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      {filterable && (
        <div className="mb-9 flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="chip"
              data-active={active === cat}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="shots">
        {visible.map((item, i) => (
          <figure
            key={item.id}
            className="shot m-0"
            data-reveal="pop"
            style={{ "--i": i % 6 } as React.CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.after} alt={`${item.title} — ${item.category}`} loading="lazy" />
            <figcaption>
              <span className="name truncate">{item.title}</span>
              <span className="tagpill" style={{ "--pill": pillColor(item.category) } as React.CSSProperties}>
                {item.category}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

"use client";

import { coverOf, tileSpans } from "../data/catalog";
import { useCatalog } from "../data/useCatalog";
import { waLink } from "../data/contact";

// El muro de productos: rejilla editorial asimétrica con la portada de cada
// sección del catálogo (editable desde /admin). Cada tarjeta abre WhatsApp
// con el pedido escrito.
export default function ProductWall() {
  const { sections } = useCatalog();
  const spans = tileSpans(sections.length);

  return (
    <div className="wall">
      {sections.map((section, i) => {
        const cover = coverOf(section);
        const span = spans[i];
        return (
          <a
            key={section.id}
            href={waLink(`¡Hola! Me interesa: ${section.title}. ¿Me pasas precio?`)}
            target="_blank"
            rel="noopener noreferrer"
            className={`tile ${span}`}
            data-reveal="pop"
            style={{ "--tile": section.color, "--i": i } as React.CSSProperties}
          >
            {section.tagline && <span className="flag">{section.tagline}</span>}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {cover && <img src={cover} alt={section.title} loading={i > 1 ? "lazy" : undefined} />}
            <span className="veil" />
            <span className="cap">
              <h3 className={span === "big" ? "text-4xl sm:text-5xl" : "text-2xl"}>{section.title}</h3>
              {span && section.description && <p className="max-w-sm">{section.description}</p>}
              <span className="go">
                Pedir por WhatsApp <b aria-hidden>→</b>
              </span>
            </span>
          </a>
        );
      })}
    </div>
  );
}

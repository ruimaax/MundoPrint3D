import { categories, products } from "../data/products";
import { waLink } from "../data/contact";

// El muro de productos: rejilla editorial asimétrica con la foto de cada
// categoría en grande. Es el corazón de la web, todo gira alrededor del
// producto. Cada tarjeta abre WhatsApp con el pedido escrito.

const TINT: Record<string, string> = {
  "funko-personalizado": "var(--blue)",
  "funko-seleccion": "var(--red)",
  "funko-semanasanta": "var(--pink)",
  mascota: "var(--yellow)",
  llaveros: "var(--green)",
  rotulos: "var(--blue)",
  deco: "var(--red)",
  medida: "var(--ink)",
};

// span en la rejilla bento (escritorio)
const SPAN: Record<string, string> = {
  "funko-personalizado": "big",
  rotulos: "wide",
};

export default function ProductWall() {
  return (
    <div className="wall">
      {categories.map((cat, i) => {
        const product = products.find((p) => p.id === cat.id);
        return (
          <a
            key={cat.id}
            href={waLink(`¡Hola! Me interesa: ${cat.orderTitle}. ¿Me pasas precio?`)}
            target="_blank"
            rel="noopener noreferrer"
            className={`tile ${SPAN[cat.id] ?? ""}`}
            data-reveal="pop"
            style={{ "--tile": TINT[cat.id], "--i": i } as React.CSSProperties}
          >
            {product?.tagline && <span className="flag">{product.tagline}</span>}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cat.image} alt={cat.title} loading={i > 1 ? "lazy" : undefined} />
            <span className="veil" />
            <span className="cap">
              <h3 className={cat.id === "funko-personalizado" ? "text-4xl sm:text-5xl" : "text-2xl"}>
                {cat.title}
              </h3>
              {(SPAN[cat.id] || cat.id === "funko-personalizado") && product?.description && (
                <p className="max-w-sm">{product.description}</p>
              )}
              <span className="go">Pedir por WhatsApp <b aria-hidden>→</b></span>
            </span>
          </a>
        );
      })}
    </div>
  );
}

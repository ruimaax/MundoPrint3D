import { categories, products } from "./products";
import { galleryItems } from "./gallery";

// Catálogo editable desde /admin. Cada sección sale como tarjeta en el
// catálogo (con su portada) y sus fotos salen en la vitrina.
// La copia buena vive en Cloudflare R2 (catalog.json); esto es la semilla
// inicial y el respaldo si la API no responde.

export type Photo = {
  id: string;
  src: string;
  title?: string;
};

export type Section = {
  id: string;
  title: string;
  /** Color de fondo de la tarjeta mientras carga la imagen. */
  color: string;
  /** Imagen de la tarjeta del catálogo. Si falta, se usa la primera foto. */
  cover?: string;
  description?: string;
  /** Etiqueta pequeña sobre la tarjeta ("El más pedido"). */
  tagline?: string;
  photos: Photo[];
};

export type Catalog = {
  sections: Section[];
};

// Colores que el panel ofrece para las secciones nuevas.
export const SECTION_COLORS = [
  "#1f45ff",
  "#ff3b2e",
  "#ff3d8b",
  "#ffc400",
  "#10b981",
  "#6c4cff",
  "#201436",
];

const TINT: Record<string, string> = {
  "funko-personalizado": "#1f45ff",
  "funko-seleccion": "#ff3b2e",
  "funko-semanasanta": "#ff3d8b",
  mascota: "#ffc400",
  llaveros: "#10b981",
  rotulos: "#1f45ff",
  deco: "#ff3b2e",
  medida: "#201436",
};

// Categoría de cada foto antigua de la galería → sección.
const GALLERY_TO_SECTION: Record<string, string> = {
  "Funko personalizado": "funko-personalizado",
  "Semana Santa": "funko-semanasanta",
  "Funko de mascota": "mascota",
  "Pieza a medida": "medida",
};

export const SEED_CATALOG: Catalog = {
  sections: categories.map((cat) => {
    const product = products.find((p) => p.id === cat.id);
    return {
      id: cat.id,
      title: cat.title,
      color: TINT[cat.id] ?? cat.bg,
      cover: cat.image,
      description: product?.description,
      tagline: product?.tagline,
      photos: galleryItems
        .filter((item) => GALLERY_TO_SECTION[item.category] === cat.id)
        .map((item) => ({ id: item.id, src: item.after, title: item.title })),
    };
  }),
};

// Texto oscuro sobre colores claros (amarillo) y blanco sobre el resto.
export function inkOn(color: string): string {
  const n = parseInt(color.slice(1), 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 160 ? "#201436" : "#ffffff";
}

export function coverOf(section: Section): string | undefined {
  return section.cover ?? section.photos[0]?.src;
}

export type Shot = Photo & { section: string; color: string };

// Todas las fotos de la vitrina, sección a sección.
export function allShots(catalog: Catalog): Shot[] {
  return catalog.sections.flatMap((s) =>
    s.photos.map((p) => ({ ...p, section: s.title, color: s.color })),
  );
}

// Fotos de la portada: se van alternando secciones para que haya variedad
// (las fotos nuevas se añaden al principio de su sección, así que salen antes).
export function homeShots(catalog: Catalog, count = 6): Shot[] {
  const queues = catalog.sections.map((s) =>
    s.photos.map((p) => ({ ...p, section: s.title, color: s.color })),
  );
  const out: Shot[] = [];
  for (let round = 0; out.length < count; round++) {
    let added = false;
    for (const q of queues) {
      if (q[round] && out.length < count) {
        out.push(q[round]);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}

// Tamaño de cada tarjeta en la rejilla de 4 columnas del catálogo: la primera
// va en grande (2×2) y se ensanchan las últimas para no dejar huecos.
export function tileSpans(count: number): ("big" | "wide" | "full" | "")[] {
  const spans: ("big" | "wide" | "full" | "")[] = Array(count).fill("");
  if (count === 0) return spans;
  spans[0] = "big";
  const rest = count - 1;
  // Las dos filas junto a la grande admiten 2 tarjetas cada una (4 huecos).
  if (rest <= 4) {
    if (rest === 1) spans[1] = "wide";
    if (rest === 2) spans[1] = spans[2] = "wide";
    if (rest === 3) spans[3] = "wide";
    return spans;
  }
  const tail = (rest - 4) % 4;
  if (tail === 1) spans[count - 1] = "full";
  if (tail === 2) {
    spans[count - 1] = "wide";
    spans[count - 2] = "wide";
  }
  if (tail === 3) spans[count - 1] = "wide";
  return spans;
}

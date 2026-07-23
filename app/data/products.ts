export type Product = {
  id: string;
  title: string;
  description: string;
  // Aparece como etiqueta pequeña sobre la tarjeta (solo destacados).
  tagline?: string;
  // Los destacados salen en grande arriba; el resto va en el carrusel.
  featured?: boolean;
  // Cuando haya foto real: guárdala en /public/products y añade
  // image: "/products/nombre.webp". Sustituye a la ilustración.
  image?: string;
};

// Categorías del carrusel principal y del bloque "Categorías destacadas".
// El color es el fondo de la tarjeta; el id apunta a su ilustración.
export type Category = {
  id: string;
  title: string;
  // Debe coincidir con una opción de PROJECT_TYPES (QuoteForm) para que el
  // formulario llegue con el tipo ya elegido.
  orderTitle: string;
  bg: string;
  dark?: boolean;
  image?: string;
};

// OJO: varios archivos de /public/products están intercambiados en disco
// (el nombre no coincide con el arte que contienen). Las rutas de aquí
// apuntan al ARTE correcto, no al nombre "lógico":
//   funko_seleccion.jpg  → arte de "Piezas a medida"
//   rotulos.jpg          → arte de "Semana Santa"
//   medida.jpg           → arte de "Rótulos y nombres"
// Para la Selección no hay promo; usamos la foto real de un encargo futbolero.
export const categories: Category[] = [
  { id: "funko-personalizado", title: "Funkos personalizados", orderTitle: "Funko personalizado", bg: "#6c4cff", dark: true, image: "/products/funko_personalizado.jpg" },
  { id: "funko-seleccion", title: "Funkos de la Selección", orderTitle: "Funkos de la Selección", bg: "#ffb97a", image: "/gallery/ceuti1.webp" },
  { id: "funko-semanasanta", title: "Semana Santa", orderTitle: "Funkos de Semana Santa", bg: "#c4b5fd", image: "/products/rotulos.jpg" },
  { id: "mascota", title: "Funkos de mascotas", orderTitle: "Funko de tu mascota", bg: "#fcd34d", image: "/products/mascota.jpg" },
  { id: "llaveros", title: "Llaveros y detalles", orderTitle: "Llaveros", bg: "#7dd3fc", image: "/products/llaveros.jpg" },
  { id: "rotulos", title: "Rótulos y nombres", orderTitle: "Rótulos y nombres", bg: "#f9a8d4", image: "/products/medida.jpg" },
  { id: "deco", title: "Decoración y figuras", orderTitle: "Decoración y figuras", bg: "#86efac", image: "/products/deco.jpg" },
  { id: "medida", title: "Piezas a medida", orderTitle: "Piezas a medida", bg: "#e2e8f0", image: "/products/funko_seleccion.jpg" },
];

export const products: Product[] = [
  {
    id: "funko-personalizado",
    title: "Funko personalizado",
    tagline: "El más pedido",
    featured: true,
    description:
      "Tú, tu pareja o quien tú quieras convertido en figura. Me pasas una foto y lo modelo con su ropa, su pelo y sus detalles.",
  },
  {
    id: "funko-seleccion",
    title: "Funkos de la Selección",
    description:
      "Los jugadores de la Selección Española en versión funko. Para coleccionar o para regalar el de tu favorito.",
  },
  {
    id: "funko-semanasanta",
    title: "Funkos de Semana Santa",
    description:
      "Nazarenos y costaleros en miniatura, con la túnica y los colores de tu hermandad.",
  },
  {
    id: "mascota",
    title: "Funko de tu mascota",
    tagline: "Para los peludos",
    featured: true,
    description: "Tu perro o tu gato hecho figura, a partir de una foto.",
  },
  {
    id: "rotulos",
    title: "Rótulos y nombres",
    description: "Nombres, logos y frases con volumen, para pared o mesa.",
  },
  {
    id: "llaveros",
    title: "Llaveros",
    tagline: "El detalle top",
    featured: true,
    description: "Con nombre, con forma de lo que quieras o con tu escudo.",
  },
  {
    id: "eventos",
    title: "Detalles para eventos",
    description: "Bodas, comuniones y cumples: series de detalles iguales.",
  },
  {
    id: "deco",
    title: "Decoración y figuras",
    description: "Macetas, soportes y piezas decorativas a tu gusto.",
  },
  {
    id: "medida",
    title: "Piezas a medida",
    description: "Recambios y piezas que no se venden en ningún sitio.",
  },
];

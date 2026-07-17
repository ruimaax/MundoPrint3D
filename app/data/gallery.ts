// Galería de trabajos reales del taller.
//
// De momento se alimenta de este array. Cuando tengamos los datos de la base
// de datos, solo hay que sustituir `getGallery` por la consulta
// correspondiente: el resto de la web no cambia.
//
// `home: true` marca las piezas que salen en la portada; el resto solo se ve
// en la página /galeria ("Ver todos los trabajos").
//
// Para añadir una pieza a mano:
//   1. Optimiza la foto (recomendado: ancho ~1000px, formato webp) y
//      guárdala en /public/gallery
//   2. Añade una entrada aquí con su ruta

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  /** Foto de la pieza terminada. */
  after: string;
  /** Foto de referencia que mandó el cliente (opcional). */
  before?: string;
  /** Pie de foto corto. */
  caption?: string;
  /** Sale en la portada. */
  home?: boolean;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "pepe",
    title: "Pepe",
    category: "Funko personalizado",
    after: "/gallery/pepe.webp",
    caption: "Con su cara, su ropa y su nombre en la caja.",
    home: true,
  },
  {
    id: "virgen",
    title: "Virgen del Carmen",
    category: "Semana Santa",
    after: "/gallery/virgen.webp",
    caption: "Encargo por Semana Santa, con todo el detalle del paso.",
    home: true,
  },
  {
    id: "alvaro",
    title: "Álvaro",
    category: "Funko personalizado",
    after: "/gallery/alvaro.webp",
    caption: "Aficionado hasta en la figura.",
    home: true,
  },
  {
    id: "gordo",
    title: "Gordo",
    category: "Funko de mascota",
    after: "/gallery/gordo.webp",
    home: true,
  },
  {
    id: "gus",
    title: "Gus",
    category: "Funko de mascota",
    after: "/gallery/gus.webp",
    home: true,
  },
  {
    id: "fami",
    title: "Encargo familiar",
    category: "Funko personalizado",
    after: "/gallery/fami.webp",
    caption: "Dos figuras a la vez, cada una con su estilo.",
    home: true,
  },
  {
    id: "moto",
    title: "A medida",
    category: "Pieza a medida",
    after: "/gallery/moto.webp",
    caption: "No todo es estilo funko: también piezas totalmente a medida.",
    home: true,
  },
  {
    id: "judo",
    title: "Judoka",
    category: "Funko personalizado",
    after: "/gallery/judo.webp",
    home: true,
  },
  {
    id: "legio",
    title: "A medida",
    category: "Pieza a medida",
    after: "/gallery/legio.webp",
    home: true,
  },
  {
    id: "anil",
    title: "Anil",
    category: "Funko personalizado",
    after: "/gallery/anil.webp",
    caption: "De piloto, con su dorsal y todo.",
  },
  {
    id: "eloy",
    title: "Eloy «Tiburoncito»",
    category: "Funko personalizado",
    after: "/gallery/eloy.webp",
    caption: "Nadador de competición, gafas incluidas.",
  },
  {
    id: "antonio",
    title: "Antonio",
    category: "Funko personalizado",
    after: "/gallery/antonio.webp",
    caption: "En modo superhéroe.",
  },
  {
    id: "ceuti1",
    title: "El más futbolero",
    category: "Funko personalizado",
    after: "/gallery/ceuti1.webp",
    caption: "Con los colores de su equipo de siempre.",
  },
  {
    id: "enf",
    title: "Enfermero",
    category: "Pieza a medida",
    after: "/gallery/enf.webp",
    caption: "Un detalle para agradecer a quien cuida.",
  },
  {
    id: "franythor",
    title: "Fran y Thor",
    category: "Funko personalizado",
    after: "/gallery/franythor.webp",
    caption: "Dueño y perro en la misma caja.",
  },
  {
    id: "lara",
    title: "Lara",
    category: "Funko personalizado",
    after: "/gallery/lara.webp",
    caption: "Versión ninja, como ella quería.",
  },
  {
    id: "lara2",
    title: "Lara",
    category: "Funko personalizado",
    after: "/gallery/lara2.webp",
  },
  {
    id: "manuel",
    title: "Manuel",
    category: "Funko personalizado",
    after: "/gallery/manuel.webp",
    caption: "Con armadura y acabado metalizado.",
  },
  {
    id: "milode",
    title: "Milo",
    category: "Pieza a medida",
    after: "/gallery/milode.webp",
    caption: "Pintado a mano con acabado dorado.",
  },
  {
    id: "natalia",
    title: "Natalia",
    category: "Funko personalizado",
    after: "/gallery/natalia.webp",
    caption: "Bailarina, de la barra a la vitrina.",
  },
  {
    id: "neo",
    title: "Neo",
    category: "Funko de mascota",
    after: "/gallery/neo.webp",
  },
];

export function getGallery(): GalleryItem[] {
  return galleryItems;
}

export function getHomeGallery(): GalleryItem[] {
  return galleryItems.filter((item) => item.home);
}

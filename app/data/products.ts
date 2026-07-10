export type Product = {
  title: string;
  category: string;
  image: string;
  description: string;
  featured?: boolean;
};

// Para publicar una pieza nueva: guarda la foto en /public/products y añade
// aquí una entrada. La galería se adapta sola a escritorio y móvil.
export const products: Product[] = [
  {
    title: "Rótulos y nombres",
    category: "Personalización",
    image: "/video-split/frame_080.webp",
    description:
      "Logotipos, nombres y placas con color, volumen y personalidad propia.",
    featured: true,
  },
  {
    title: "Prototipos a medida",
    category: "Diseño funcional",
    image: "/video-split/frame_045.webp",
    description:
      "Pruebas de concepto y piezas que ayudan a validar una idea antes de producirla.",
  },
  {
    title: "Series pequeñas",
    category: "Producción",
    image: "/video-split/frame_018.webp",
    description:
      "Unidades repetibles para eventos, marcas, regalos o pequeños negocios.",
  },
];

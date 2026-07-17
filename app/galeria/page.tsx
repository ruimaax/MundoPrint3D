import type { Metadata } from "next";
import { GalleryPiece } from "../components/Gallery";
import FunkoEyes from "../components/FunkoEyes";
import Header from "../components/Header";
import MiniFunko from "../components/MiniFunko";
import WhatsAppBubble from "../components/WhatsAppBubble";
import { getGallery } from "../data/gallery";

export const metadata: Metadata = {
  title: "Galería de trabajos — Mundo Print 3D",
  description:
    "Todos los funkos personalizados, figuras de mascotas y piezas a medida que han salido del taller de Mundo Print 3D.",
};

export default function GaleriaPage() {
  const items = getGallery();

  return (
    <main className="min-h-screen bg-white text-[#191430]">
      <FunkoEyes />
      <Header />

      <section className="px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">
                Galería completa
              </p>
              <h1 className="font-display mt-2 text-4xl font-extrabold sm:text-5xl">
                Todo lo que ha salido del taller
              </h1>
              <p className="mt-3 leading-7 text-[#191430]/70">
                Cada pieza se modeló para una persona concreta. La tuya puede
                ser la siguiente.
              </p>
            </div>
            <div className="funko-guide">
              <MiniFunko variant="fotografo" className="funko-idle w-16 shrink-0 sm:w-20" />
              <p className="speech">¿Cuál te pido? Ah no, que es al revés.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <GalleryPiece key={item.id} {...item} />
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a className="btn-pop btn-grape text-lg" href="/#encargo">
              Pedir el mío
            </a>
            <a className="btn-pop btn-white text-lg" href="/">
              Volver a la portada
            </a>
          </div>
        </div>
      </section>

      <WhatsAppBubble />
    </main>
  );
}

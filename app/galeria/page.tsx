import type { Metadata } from "next";
import FunkoEyes from "../components/FunkoEyes";
import { FunkoGuide } from "../components/MiniFunko";
import SiteNav from "../components/SiteNav";
import WhatsAppDock from "../components/WhatsAppDock";
import WorksGrid from "../components/WorksGrid";
import { getGallery } from "../data/gallery";

export const metadata: Metadata = {
  title: "La vitrina — Mundo Print 3D",
  description:
    "Todos los funkos personalizados, figuras de mascotas y piezas a medida que han salido del taller de Mundo Print 3D.",
};

export default function GaleriaPage() {
  const items = getGallery();

  return (
    <main className="min-h-screen">
      <FunkoEyes />
      <SiteNav />

      <section className="field-blue px-5 pb-12 pt-24 sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker rise text-toy-yellow">La vitrina · {items.length} piezas</p>
              <h1
                className="display rise mt-3 text-5xl sm:text-7xl"
                style={{ "--rise-delay": "70ms" } as React.CSSProperties}
              >
                Todo lo que ha <span className="text-toy-yellow">salido del taller</span>
              </h1>
              <p
                className="rise mt-4 max-w-md font-medium leading-7 text-white/85"
                style={{ "--rise-delay": "150ms" } as React.CSSProperties}
              >
                Cada pieza se modeló para una persona concreta. La tuya puede
                ser la siguiente.
              </p>
            </div>
            <FunkoGuide variant="fotografo" flip className="rise">
              Filtra por tipo y elige tu favorito.
            </FunkoGuide>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-shell">
          <WorksGrid items={items} filterable />

          <div className="mt-14 flex flex-wrap justify-center gap-4">
            <a className="btn btn-red text-lg" href="/#pedido">
              Pedir el mío
            </a>
            <a className="btn btn-ink text-lg" href="/">
              ← Volver a la tienda
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-toy-ink px-5 py-10 text-center text-white sm:px-8">
        <p className="display text-3xl">Tu mundo, impreso en 3D</p>
        <p className="mt-3 text-sm font-medium text-white/55">
          Mundo Print 3D · España · © {new Date().getFullYear()}
        </p>
      </footer>

      <WhatsAppDock />
    </main>
  );
}

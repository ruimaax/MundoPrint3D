import BudgetForm from "./components/BudgetForm";
import FunkoEyes from "./components/FunkoEyes";
import MiniFunko, { FunkoGuide } from "./components/MiniFunko";
import ProductWall from "./components/ProductWall";
import SiteNav from "./components/SiteNav";
import WhatsAppDock from "./components/WhatsAppDock";
import WorksGrid from "./components/WorksGrid";
import { WA_DEFAULT } from "./data/contact";
import { getHomeGallery } from "./data/gallery";

const steps = [
  {
    n: "1",
    title: "Nos mandas la foto",
    body: "Eliges algo del catálogo y nos escribes por WhatsApp con una foto y cuatro palabras. Ya está.",
    guide: "guia" as const,
    speech: "Con dos fotos me apaño. ¡No hace falta nada raro!",
  },
  {
    n: "2",
    title: "Lo diseñamos",
    body: "Modelamos la pieza para ti, te enseñamos cómo queda y te damos precio cerrado antes de imprimir nada.",
    guide: "artista" as const,
    speech: "Te enseño el diseño ANTES de fabricar. Cero sorpresas.",
  },
  {
    n: "3",
    title: "Te llega a casa",
    body: "Se imprime, se repasa a mano y viaja bien embalado a toda España, con seguimiento.",
    guide: "repartidor" as const,
    speech: "El último tramo lo llevo yo. Bueno, yo y el mensajero.",
  },
];

const faqs = [
  {
    q: "¿Cuánto cuesta un funko personalizado?",
    a: "Depende del tamaño y del nivel de detalle. Nos cuentas la idea, la valoramos y te damos un precio cerrado antes de fabricar nada. Sin sorpresas al final.",
  },
  {
    q: "¿Qué necesitáis para empezar?",
    a: "Para una figura de una persona o mascota, dos o tres fotos donde se vea bien. Para piezas a medida, una foto, un boceto o simplemente las medidas y una explicación.",
  },
  {
    q: "¿Cuánto tarda un encargo?",
    a: "El presupuesto lo tienes en 24–48 horas. La fabricación depende de la pieza y de la cola del taller; te damos fecha concreta junto con el precio.",
  },
  {
    q: "¿Puedo pedir una sola unidad?",
    a: "Claro. Desde una unidad suelta hasta series completas para bodas, comuniones y eventos.",
  },
  {
    q: "¿Hacéis envíos?",
    a: "A toda España, con la pieza bien protegida y número de seguimiento. También se puede acordar entrega en mano según la zona.",
  },
  {
    q: "¿Y si lo que quiero no está en el catálogo?",
    a: "Escríbenos igualmente. Gran parte del trabajo del taller son piezas que no existen en ningún catálogo: recambios, soportes, ideas raras… de eso va esto.",
  },
];

function StarRule() {
  return (
    <div className="rule-stars" aria-hidden>
      ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
    </div>
  );
}

export default function Page() {
  const works = getHomeGallery().slice(0, 6);

  return (
    <main id="top" className="min-h-screen">
      <FunkoEyes />
      <SiteNav />

      {/* ————— HERO ————— */}
      <section className="field-blue relative overflow-hidden px-5 pb-14 pt-24 sm:px-8 sm:pb-20 sm:pt-28">
        <div className="mx-auto grid max-w-shell items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            <p className="kicker rise text-toy-yellow">Taller de impresión 3D · España</p>
            <h1
              className="display display--tight rise mt-5 text-[15vw] leading-[0.82] sm:text-7xl lg:text-8xl"
              style={{ "--rise-delay": "70ms" } as React.CSSProperties}
            >
              Tú, hecho
              <br />
              <span className="mark" style={{ "--mark": "var(--yellow)" } as React.CSSProperties}>
                figura
              </span>
            </h1>
            <p
              className="rise mt-6 max-w-md text-lg font-medium leading-7 text-white/85"
              style={{ "--rise-delay": "150ms" } as React.CSSProperties}
            >
              Funkos con tu cara, tu perro convertido en muñeco, rótulos con tu
              nombre y piezas que no existen en ninguna tienda. Impreso, pintado
              y enviado a tu casa.
            </p>
            <div
              className="rise mt-8 flex flex-wrap gap-3"
              style={{ "--rise-delay": "230ms" } as React.CSSProperties}
            >
              <a href="#catalogo" className="btn btn-yellow text-lg">
                Ver el catálogo
              </a>
              <a href="#pedido" className="btn btn-ghost text-lg text-white">
                Pedir el mío
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -right-10 -top-10 text-toy-yellow/90 sm:-right-6">
              <svg viewBox="0 0 100 100" className="h-40 w-40 sm:h-56 sm:w-56" aria-hidden>
                <path
                  d="M50 3 L60 33 L92 33 L66 52 L76 84 L50 64 L24 84 L34 52 L8 33 L40 33 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="rise relative overflow-hidden rounded-[26px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]" style={{ "--rise-delay": "120ms" } as React.CSSProperties}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/products/funko_personalizado.jpg"
                alt="Funko personalizado en el taller"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/5]"
              />
            </div>
          </div>
        </div>

        {/* mascota que asoma por abajo */}
        <div className="peek pointer-events-none absolute -bottom-1 left-4 hidden items-end gap-3 sm:flex">
          <MiniFunko variant="obrero" className="funko-idle w-20" />
        </div>
      </section>

      {/* ————— CATÁLOGO (protagonista) ————— */}
      <section id="catalogo" className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker">El catálogo</p>
              <h2 className="display mt-3 text-5xl sm:text-6xl">
                Elige tu <span className="text-toy-red">favorito</span>
              </h2>
            </div>
            <FunkoGuide variant="fotografo" flip>
              Toca cualquiera y se abre WhatsApp con el pedido escrito.
            </FunkoGuide>
          </div>

          <div className="mt-9">
            <ProductWall />
          </div>
        </div>
      </section>

      <StarRule />

      {/* ————— CÓMO SE HACE ————— */}
      <section id="como" className="field-red px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-shell">
          <p className="kicker text-toy-yellow">Cómo se hace</p>
          <h2 className="display mt-3 max-w-3xl text-4xl sm:text-6xl">
            De tu foto a tu figura, <span className="text-toy-yellow">te lo cuentan ellos</span>
          </h2>

          <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.n} className="step">
                <span className="n">{step.n}</span>
                <h3>{step.title}</h3>
                <p className="mt-2.5 max-w-xs font-medium leading-7 text-white/85">
                  {step.body}
                </p>
                <FunkoGuide variant={step.guide} className="mt-6">
                  {step.speech}
                </FunkoGuide>
              </article>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-12 gap-y-6">
            {[
              ["24–48 h", "para darte precio y fecha"],
              ["Desde 1 unidad", "o una serie entera, tú decides"],
              ["Diseño propio", "cada pieza se modela para ti"],
            ].map(([value, label]) => (
              <div key={value}>
                <p className="display text-3xl text-toy-yellow">{value}</p>
                <p className="mt-1 text-sm font-medium text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— VITRINA ————— */}
      <section id="vitrina" className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker">La vitrina</p>
              <h2 className="display mt-3 text-5xl sm:text-6xl">
                Piezas <span className="text-toy-blue">reales</span>
              </h2>
              <p className="mt-3 max-w-md font-medium text-toy-ink/70">
                Cada una se modeló para una persona concreta. La siguiente
                puede llevar tu nombre.
              </p>
            </div>
            <a href="/galeria" className="btn btn-ink">
              Ver todas →
            </a>
          </div>

          <div className="mt-9">
            <WorksGrid items={works} />
          </div>
        </div>
      </section>

      {/* ————— DUDAS ————— */}
      <section id="dudas" className="field-yellow px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-shell gap-10 lg:grid-cols-[0.8fr_1.4fr]">
          <div>
            <p className="kicker">Dudas</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">
              Lo que nos <span className="text-toy-red">preguntáis</span>
            </h2>
            <FunkoGuide variant="gamer" className="mt-8">
              ¿Falta la tuya? Escríbenos, contestamos rapidito.
            </FunkoGuide>
          </div>

          <div>
            {faqs.map((faq) => (
              <details key={faq.q} className="faq">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ————— PEDIDO ————— */}
      <section id="pedido" className="field-ink px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-shell items-start gap-10 lg:grid-cols-[0.9fr_1.3fr]">
          <div>
            <p className="kicker text-toy-yellow">Tu pedido</p>
            <h2 className="display mt-3 text-5xl sm:text-6xl">
              Pide <span className="text-toy-yellow">el tuyo</span>
            </h2>
            <p className="mt-5 max-w-sm font-medium leading-7 text-white/80">
              Rellenas esto y se abre WhatsApp con todo escrito. Ahí cerramos
              precio y fecha. Más fácil imposible.
            </p>
            <FunkoGuide variant="repartidor" className="mt-8">
              En cuanto esté, ¡sale para tu casa!
            </FunkoGuide>
            <a
              href={WA_DEFAULT}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-green mt-8"
            >
              O escríbenos directamente
            </a>
          </div>

          <div className="rounded-[24px] bg-toy-cream p-6 text-toy-ink shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)] sm:p-9">
            <BudgetForm />
          </div>
        </div>
      </section>

      {/* ————— FOOTER ————— */}
      <footer className="bg-toy-ink px-5 pb-10 pt-4 text-white sm:px-8">
        <div className="mx-auto max-w-shell">
          <p className="display text-center text-[13vw] leading-none text-white/10 sm:text-[9rem]">
            Mundo Print 3D
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-6">
            <p className="font-semibold text-white/60">
              Tu mundo, impreso en 3D · © {new Date().getFullYear()}
            </p>
            <nav className="flex flex-wrap gap-6 font-bold">
              <a className="hover:text-toy-yellow" href="#catalogo">Catálogo</a>
              <a className="hover:text-toy-yellow" href="#como">Cómo se hace</a>
              <a className="hover:text-toy-yellow" href="/galeria">Vitrina</a>
              <a className="hover:text-toy-yellow" href="#pedido">Pedir</a>
            </nav>
          </div>
        </div>
      </footer>

      <WhatsAppDock />
    </main>
  );
}

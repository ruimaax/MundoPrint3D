import BudgetForm from "./components/BudgetForm";
import FunkoEyes from "./components/FunkoEyes";
import MiniFunko, { FunkoGuide } from "./components/MiniFunko";
import PrintScene, { HeroIdeaProvider, HeroTitle } from "./components/PrintScene";
import ProductWall from "./components/ProductWall";
import ScrollReveal from "./components/ScrollReveal";
import SiteFooter from "./components/SiteFooter";
import SiteNav from "./components/SiteNav";
import WhatsAppDock from "./components/WhatsAppDock";
import WorksGrid from "./components/WorksGrid";
import { WA_DEFAULT } from "./data/contact";

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
    q: "¿Y si lo que quiero no está en el catálogo?",
    a: "Escríbenos igualmente. Gran parte del trabajo del taller son piezas que no existen en ningún catálogo: recambios, soportes, ideas raras… de eso va esto.",
  },
];

// Destellos de cuatro puntas que parpadean en el hero.
function Sparkle({
  className,
  delay,
  style,
}: {
  className: string;
  delay: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`sparkle ${className}`}
      style={{ animationDelay: delay, ...style }}
      aria-hidden
    >
      <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" fill="currentColor" />
    </svg>
  );
}

// Cielo de destellos blancos del hero: posición (%), tamaño (px), retraso y
// duración (s). Fijos para que servidor y cliente pinten lo mismo.
const SKY: [number, number, number, number, number][] = [
  [4, 8, 10, 0.2, 2.6], [12, 3, 7, 1.4, 3.1], [19, 16, 12, 0.7, 2.2], [27, 5, 8, 2.1, 3.4],
  [34, 12, 14, 0.4, 2.8], [41, 4, 9, 1.8, 2.4], [47, 20, 7, 0.9, 3.2], [53, 7, 11, 2.5, 2.7],
  [58, 3, 16, 1.1, 3.6], [64, 18, 8, 0.1, 2.5], [71, 2, 10, 1.6, 3.0], [79, 6, 7, 2.8, 2.3],
  [86, 3, 13, 0.5, 3.3], [93, 10, 9, 1.9, 2.6], [97, 30, 12, 1.2, 2.9], [2, 38, 8, 2.3, 3.1],
  [2, 64, 11, 0.8, 2.4], [15, 88, 9, 1.5, 3.5], [40, 78, 7, 0.3, 2.7], [31, 92, 13, 2.2, 3.0],
  [38, 70, 8, 1.0, 2.5], [44, 86, 10, 2.6, 3.2], [49, 55, 6, 0.6, 2.8], [52, 34, 9, 1.7, 3.4],
  [56, 90, 14, 0.2, 2.3], [61, 62, 7, 2.4, 3.1], [67, 94, 9, 1.3, 2.6], [74, 88, 12, 0.7, 3.3],
  [82, 95, 8, 2.0, 2.4], [90, 90, 11, 1.1, 3.0], [96, 70, 7, 0.4, 2.7], [99, 50, 9, 2.7, 3.5],
  [45, 42, 6, 1.9, 2.9], [36, 48, 5, 0.9, 3.2], [89, 45, 8, 2.9, 2.5], [70, 40, 6, 1.4, 3.1],
];

export default function Page() {
  return (
    <main id="top" className="min-h-screen">
      <FunkoEyes />
      <ScrollReveal />
      <SiteNav />

      {/* ————— HERO ————— */}
      <section className="field-blue relative overflow-hidden px-5 pb-14 pt-24 sm:px-8 sm:pb-20 sm:pt-28">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {SKY.map(([x, y, size, delay, dur], i) => (
            <Sparkle
              key={i}
              className="text-white"
              delay={`${delay}s`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size * 1.7,
                height: size * 1.7,
                zIndex: 0,
                animationDuration: `${dur}s`,
              }}
            />
          ))}
        </div>
        <HeroIdeaProvider>
        <div className="mx-auto grid max-w-shell items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            <p className="kicker rise text-toy-yellow">Taller de impresión 3D · España</p>
            <HeroTitle
              className="display display--tight rise mt-5 text-[13vw] leading-[0.82] sm:text-7xl lg:text-8xl"
              style={{ "--rise-delay": "70ms" } as React.CSSProperties}
            />
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
            <Sparkle className="-left-3 top-10 h-7 w-7 text-toy-yellow" delay="0s" />
            <Sparkle className="-left-8 bottom-24 h-5 w-5 text-white" delay="1.1s" />
            <Sparkle className="-right-4 bottom-10 h-9 w-9 text-toy-pink" delay="0.5s" />
            <div className="pointer-events-none absolute -right-10 -top-10 text-toy-yellow/90 sm:-right-6">
              <svg viewBox="0 0 100 100" className="hero-star h-40 w-40 sm:h-56 sm:w-56" aria-hidden>
                <path
                  d="M50 3 L60 33 L92 33 L66 52 L76 84 L50 64 L24 84 L34 52 L8 33 L40 33 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="rise" style={{ "--rise-delay": "120ms" } as React.CSSProperties}>
            <div className="hero-float">
              <PrintScene />
            </div>
            </div>
          </div>
        </div>

        </HeroIdeaProvider>

        {/* mascota que asoma por abajo */}
        <div className="peek pointer-events-none absolute -bottom-1 left-4 hidden items-end gap-3 sm:flex">
          <MiniFunko variant="obrero" className="funko-idle w-20" />
        </div>
      </section>

      {/* ————— CATÁLOGO (protagonista) ————— */}
      <section id="catalogo" className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-shell">
          <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
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


      {/* ————— CÓMO SE HACE ————— */}
      <section id="como" className="field-red px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-shell">
          <p className="kicker text-toy-yellow" data-reveal>Cómo se hace</p>
          <h2 className="display mt-3 max-w-3xl text-4xl sm:text-6xl" data-reveal>
            De tu foto a tu figura, <span className="text-toy-yellow">te lo cuentan ellos</span>
          </h2>

          <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <article
                key={step.n}
                className="step"
                data-reveal
                style={{ "--i": i * 2 } as React.CSSProperties}
              >
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
            ].map(([value, label], i) => (
              <div key={value} data-reveal="pop" style={{ "--i": i } as React.CSSProperties}>
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
          <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
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
            <WorksGrid />
          </div>
        </div>
      </section>

      {/* ————— DUDAS ————— */}
      <section id="dudas" className="field-yellow px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-shell gap-10 lg:grid-cols-[0.8fr_1.4fr]">
          <div data-reveal>
            <p className="kicker">Dudas</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">
              Lo que nos <span className="text-toy-red">preguntáis</span>
            </h2>
            <FunkoGuide variant="gamer" className="mt-8">
              ¿Falta la tuya? Escríbenos, contestamos rapidito.
            </FunkoGuide>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <details
                key={faq.q}
                className="faq"
                data-reveal="side"
                style={{ "--i": i } as React.CSSProperties}
              >
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
          <div data-reveal>
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

          <div data-reveal="pop" style={{ "--i": 2 } as React.CSSProperties} className="rounded-[24px] bg-toy-cream p-6 text-toy-ink shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)] sm:p-9">
            <BudgetForm />
          </div>
        </div>
      </section>

      <SiteFooter />

      <WhatsAppDock />
    </main>
  );
}

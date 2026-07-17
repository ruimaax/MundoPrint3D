import Catalog from "./components/Catalog";
import CategoryHero from "./components/CategoryHero";
import Faq from "./components/Faq";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import WhatsAppBubble from "./components/WhatsAppBubble";
import FunkoEyes from "./components/FunkoEyes";
import Header from "./components/Header";
import MiniFunko, { FunkoGuide } from "./components/MiniFunko";
import Peeker from "./components/Peeker";
import Mundial from "./components/Mundial";
import QuoteForm from "./components/QuoteForm";
import ScrollFx from "./components/ScrollFx";

const steps = [
  {
    number: "1",
    title: "Cuéntamelo",
    body: "Elige algo del catálogo, monta tu funko ahí arriba o mándame una foto con una explicación por encima.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l2-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.4-8.5h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Te paso el precio",
    body: "Lo diseño, te enseño cómo quedaría y te doy un precio cerrado antes de imprimir nada.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20.6 13.4 11 3.8a2 2 0 0 0-1.4-.6H4a1 1 0 0 0-1 1v5.6c0 .5.2 1 .6 1.4l9.6 9.6a2 2 0 0 0 2.8 0l4.6-4.6a2 2 0 0 0 0-2.8Z" />
        <circle cx="7.5" cy="7.5" r="1.5" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Te lo entrego",
    body: "Imprimo la pieza, la reviso a mano y te la mando lista para regalar, coleccionar o usar.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
];

const perks = [
  {
    title: "Envíos a toda España",
    body: "Bien embalado y con seguimiento.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="1" y="6" width="14" height="12" rx="1" />
        <path d="M15 9h4l3 3v6h-7z" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    ),
  },
  {
    title: "Materiales de calidad",
    body: "Resistentes, con buen acabado.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Revisado a mano",
    body: "Cada pieza se comprueba antes de salir.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="9" r="6" />
        <path d="M9 15l-1 7 4-2 4 2-1-7" />
      </svg>
    ),
  },
  {
    title: "Trato directo",
    body: "Hablas conmigo, no con un robot.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 11.5a8.4 8.4 0 01-8.5 8.4 8.5 8.5 0 01-3.8-.9L3 21l2-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 018.4-8.5h.5a8.5 8.5 0 018 8z" />
      </svg>
    ),
  },
];

const marqueeItems = [
  "Funkos personalizados",
  "Funkos de la Selección",
  "Semana Santa",
  "Llaveros",
  "Rótulos",
  "Detalles para eventos",
  "Piezas a medida",
];

function MarqueeRun({ hidden }: { hidden?: boolean }) {
  return (
    <span aria-hidden={hidden}>
      {marqueeItems.map((item) => (
        <span key={item}>
          {item} <b>/</b>{" "}
        </span>
      ))}
    </span>
  );
}

export default function Page() {
  return (
    <main id="inicio" className="min-h-screen bg-white text-[#191430]">
      <ScrollFx />
      <FunkoEyes />
      <Header />

      <section className="px-5 pb-6 pt-28 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="rise-in mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">
                Taller de impresión 3D · España
              </p>
              <h1 className="font-display mt-2 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                Funkos, figuras y regalos <span className="marker">a tu bola</span>
              </h1>
            </div>
            <FunkoGuide variant="artista" flip className="hidden md:flex">
              Empieza por aquí: elige tu colección.
            </FunkoGuide>
          </div>

          <div className="rise-in-2">
            <CategoryHero />
          </div>
        </div>
      </section>

      <Catalog />

      <Gallery />

      <div className="marquee-stack" aria-label="Todo lo que hace Mundo Print 3D">
        <div className="fun-marquee">
          <div className="fun-marquee-track">
            <MarqueeRun />
            <MarqueeRun hidden />
          </div>
        </div>
        <div className="fun-marquee fun-marquee-alt" aria-hidden>
          <div className="fun-marquee-track">
            <MarqueeRun hidden />
            <MarqueeRun hidden />
          </div>
        </div>
      </div>

      <Mundial />

      <section id="como-funciona" className="bg-[#faf8ff] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
            <div className="max-w-xl">
              <h2 className="font-display text-balance text-4xl font-extrabold sm:text-5xl">
                Así funciona
              </h2>
              <p className="mt-3 leading-7 text-[#191430]/70">
                Sin planos, sin programas raros y sin palabrejas técnicas.
              </p>
            </div>
            <FunkoGuide variant="obrero" flip>
              Tú pones la idea. Del curro me encargo yo.
            </FunkoGuide>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.number}
                className="rounded-[6px] border-2 border-[#191430] bg-white p-7 shadow-[0_4px_0_#191430] transition-transform duration-200 hover:-translate-y-1.5"
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display grid h-11 w-11 place-items-center rounded-[6px] bg-[#6c4cff] text-lg font-bold text-white">
                    {step.number}
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-[6px] border-2 border-[#191430]/15 text-violet-700 [&>svg]:h-5 [&>svg]:w-5">
                    {step.icon}
                  </span>
                </div>
                <h3 className="font-display mt-5 text-2xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#191430]/70">{step.body}</p>
              </article>
            ))}
          </div>

          <div className="story-strip" aria-hidden>
            <div className="story-bubble b1"><span className="speech">¿Me haces uno?</span></div>
            <div className="story-bubble b2"><span className="speech">¡Marchando!</span></div>
            <div className="story-bubble b3"><span className="speech">¡Toma ya!</span></div>

            <div className="story-actor story-maker">
              <MiniFunko variant="obrero" className="w-14" />
            </div>
            <div className="story-actor story-client-a">
              <MiniFunko variant="guia" className="w-14" />
            </div>
            <div className="story-actor story-courier">
              <MiniFunko variant="repartidor" className="w-14" />
            </div>

            <div className="story-house">
              <svg viewBox="0 0 120 110" className="w-24">
                <rect x="20" y="46" width="80" height="58" rx="4" fill="white" stroke="#191430" strokeWidth="4" />
                <polygon points="10,48 60,6 110,48" fill="#6c4cff" stroke="#191430" strokeWidth="4" strokeLinejoin="round" />
                <rect x="50" y="70" width="24" height="34" rx="3" fill="#c4b5fd" stroke="#191430" strokeWidth="3.5" />
                <circle cx="35" cy="66" r="8" fill="#ffb97a" stroke="#191430" strokeWidth="3" />
              </svg>
            </div>
            <div className="story-actor story-client-b">
              <MiniFunko variant="guia" className="w-14" />
            </div>
            <div className="story-parcel">
              <svg viewBox="0 0 30 26">
                <rect x="2" y="2" width="26" height="22" rx="3" fill="#fcd34d" stroke="#191430" strokeWidth="3" />
                <path d="M15 2 v22" stroke="#191430" strokeWidth="2.5" />
              </svg>
            </div>

            <svg className="story-ground" preserveAspectRatio="none" viewBox="0 0 100 4">
              <path className="conveyor" d="M0 2 H100" />
            </svg>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center" data-reveal>
            {[
              ["24–48 h", "para darte precio y fecha"],
              ["Desde 1 unidad", "o una serie entera, tú decides"],
              ["Diseño propio", "cada pieza se modela para ti"],
            ].map(([value, label]) => (
              <div key={value}>
                <p className="font-display text-2xl font-extrabold text-violet-700">{value}</p>
                <p className="mt-0.5 text-sm text-[#191430]/60">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Reviews />

      <Faq />

      <QuoteForm />

      <section className="border-t-2 border-[#191430] bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[6px] border-2 border-[#191430] bg-[#eeeaff] text-violet-700 shadow-[0_3px_0_#191430] [&>svg]:h-5 [&>svg]:w-5">
                {perk.icon}
              </span>
              <div>
                <p className="font-display text-base font-bold leading-tight">{perk.title}</p>
                <p className="mt-0.5 text-sm text-[#191430]/60">{perk.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative border-t-2 border-[#191430] bg-white px-5 py-10 sm:px-8">
        <Peeker />
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <img
              src="/brand/mundo-print-3d-original.jpeg"
              alt="Mundo Print 3D"
              className="h-auto w-20 rounded-[6px] border-2 border-[#191430] bg-white p-1 shadow-[0_3px_0_#191430]"
            />
            <p className="mt-3 text-sm font-bold text-[#191430]/60">Tu mundo, impreso en 3D.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-[#191430]/60">
            <a className="transition hover:text-violet-700" href="#catalogo">Catálogo</a>
            <a className="transition hover:text-violet-700" href="#como-funciona">Cómo funciona</a>
            <a className="transition hover:text-violet-700" href="#encargo">Pedir presupuesto</a>
          </div>
        </div>
      </footer>

      <WhatsAppBubble />
    </main>
  );
}

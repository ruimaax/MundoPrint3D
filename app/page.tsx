import Header from "./components/Header";
import MaterialGuide from "./components/MaterialGuide";
import PrintScroll from "./components/PrintScroll";
import ProductGallery from "./components/ProductGallery";
import QuoteForm from "./components/QuoteForm";

const process = [
  {
    number: "01",
    title: "Cuéntame la idea",
    body: "Una foto, un enlace, un boceto o simplemente una explicación. No necesitas llegar con un archivo 3D.",
  },
  {
    number: "02",
    title: "Diseño y propuesta",
    body: "Reviso la viabilidad, elijo material y acabado, y te envío una propuesta clara antes de fabricar.",
  },
  {
    number: "03",
    title: "Impresión y entrega",
    body: "Imprimo, compruebo la pieza y te la entrego lista para usar. También hago series cortas.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-void text-white">
      <Header />
      <PrintScroll />

      <section id="estudio" className="studio-surface relative z-10 border-t border-white/10 px-5 py-24 sm:px-10 lg:px-16 lg:py-36">
        <span className="technical-coordinate left-5 top-28 sm:left-10 lg:left-16" aria-hidden>40.8794° N / 14.2312° E</span>
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="section-label">Impresión con intención</p>
              <h2 className="headline-display max-w-2xl text-balance text-4xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">
                Si puedes imaginarlo, podemos empezar a <span className="gradient-word">darle forma.</span>
              </h2>
            </div>

            <div className="grid gap-8 text-base leading-7 text-white/60 sm:grid-cols-2">
              <p>
                Diseño e impresión 3D cercana para regalos, decoración,
                recambios, prototipos y esas ideas difíciles de encontrar en
                una tienda.
              </p>
              <p>
                Cada encargo se revisa de forma personal: tamaño, resistencia,
                color y acabado se eligen para que la pieza tenga sentido de
                verdad.
              </p>
            </div>
          </div>

          <div className="stats-shell mt-16 grid gap-px overflow-hidden rounded-[2rem] sm:grid-cols-3">
            {[
              ["24–48 h", "para recibir una primera respuesta"],
              ["1 o 100", "desde una pieza hasta una serie corta"],
              ["A medida", "diseño adaptado a tu uso y presupuesto"],
            ].map(([value, label], index) => (
              <div key={value} className="stat-card relative px-7 py-8">
                <span className="absolute right-6 top-5 font-mono text-[10px] text-white/20">0{index + 1}</span>
                <p className="text-3xl font-semibold tracking-tight text-white">{value}</p>
                <p className="mt-2 text-sm text-white/45">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="kinetic-strip" aria-label="Servicios de Mundo Print 3D">
        <div className="kinetic-track">
          <span>DISEÑO 3D <b>✦</b> PIEZAS ÚNICAS <b>✦</b> PROTOTIPADO <b>✦</b> SERIES CORTAS <b>✦</b> OBJETOS QUE ENCAJAN <b>✦</b>&nbsp;</span>
          <span aria-hidden>DISEÑO 3D <b>✦</b> PIEZAS ÚNICAS <b>✦</b> PROTOTIPADO <b>✦</b> SERIES CORTAS <b>✦</b> OBJETOS QUE ENCAJAN <b>✦</b>&nbsp;</span>
        </div>
      </div>

      <ProductGallery />

      <section id="proceso" className="process-lab relative overflow-hidden px-5 py-24 text-[#15101d] sm:px-10 lg:px-16 lg:py-36">
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="section-label !text-violet-700">Así de fácil</p>
              <h2 className="headline-display max-w-3xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
                De una referencia a una pieza real.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-black/55">
              No hace falta saber de modelado ni materiales. Yo traduzco tu
              idea al lenguaje de la impresión 3D.
            </p>
          </div>

          <div className="mt-16 grid gap-4 lg:grid-cols-3">
            {process.map((step) => (
              <article key={step.number} className="process-card group relative flex min-h-80 flex-col justify-between overflow-hidden rounded-[2rem] p-7 sm:p-9">
                <span className="relative z-10 font-mono text-sm text-violet-700">{step.number} / 03</span>
                <span className="process-ghost-number" aria-hidden>{step.number}</span>
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-4 max-w-sm leading-7 text-black/55">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MaterialGuide />
      <QuoteForm />

      <footer className="footer-grid border-t border-white/10 px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <img
              src="/brand/mundo-print-3d-original.jpeg"
              alt="Mundo Print 3D"
              className="h-auto w-24 rounded-2xl bg-white p-1"
            />
            <p className="mt-3 text-sm text-white/40">Ideas reales, capa a capa.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/50">
            <a className="transition hover:text-white" href="#piezas">Piezas</a>
            <a className="transition hover:text-white" href="#proceso">Proceso</a>
            <a className="transition hover:text-white" href="#encargo">Pedir presupuesto</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

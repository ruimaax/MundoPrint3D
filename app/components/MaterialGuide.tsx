const materials = [
  {
    name: "PLA",
    tag: "El más versátil",
    color: "bg-[#be8cff]",
    description: "Ideal para decoración, regalos, maquetas y piezas de interior con mucho detalle.",
  },
  {
    name: "PETG",
    tag: "Más resistente",
    color: "bg-[#ff8748]",
    description: "Perfecto para piezas funcionales, humedad y usos que necesitan un extra de aguante.",
  },
  {
    name: "TPU",
    tag: "Flexible",
    color: "bg-[#4ae2b2]",
    description: "Para protectores, agarres, juntas y objetos que deben doblarse sin romperse.",
  },
];

export default function MaterialGuide() {
  return (
    <section id="materiales" className="materials-lab relative overflow-hidden border-t border-white/10 px-5 py-24 sm:px-10 lg:px-16 lg:py-36">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="section-label">Materiales sin complicaciones</p>
            <h2 className="headline-display text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Cada idea pide un material distinto.</h2>
            <p className="mt-6 max-w-md leading-7 text-white/50">Si no sabes cuál elegir, no pasa nada. Cuéntame para qué servirá la pieza y te recomendaré la mejor opción.</p>
          </div>
          <div className="grid gap-4">
            {materials.map((material) => (
              <article key={material.name} className="material-card group grid gap-5 rounded-3xl p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <span className={`filament-swatch h-12 w-12 rounded-2xl ${material.color}`} />
                <div>
                  <h3 className="text-xl font-semibold">{material.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/45">{material.description}</p>
                </div>
                <span className="w-fit rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/55">{material.tag}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

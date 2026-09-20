"use client";

import { useCatalog } from "../data/useCatalog";
import { PHONE, WA_DEFAULT } from "../data/contact";

const NAV = [
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#como", label: "Cómo se hace" },
  { href: "/galeria", label: "Vitrina" },
  { href: "/#dudas", label: "Dudas" },
  { href: "/#pedido", label: "Pedir el mío" },
];

// +34 644 19 55 90
const PHONE_LABEL = `+${PHONE.slice(0, 2)} ${PHONE.slice(2, 5)} ${PHONE.slice(5, 7)} ${PHONE.slice(7, 9)} ${PHONE.slice(9)}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.5-.6c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.5 3.9.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.6Z" />
    </svg>
  );
}

// Pie de página: bloque oscuro a todo el ancho con cuatro columnas, la marca en gigante y
// una línea final con el copyright.
export default function SiteFooter() {
  const { sections } = useCatalog();
  return (
    <footer className="foot text-white">
      <div className="foot-stripe" aria-hidden />
      <div>
        <div className="mx-auto max-w-shell px-5 sm:px-10">
          <div className="grid gap-10 pt-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-8">
            <div>
              <p className="foot-head">El taller</p>
              <p className="mt-5 max-w-xs font-medium leading-7 text-white/80">
                Funkos personalizados, figuras de mascotas y regalos únicos
                impresos en 3D.
              </p>
              <p className="mt-3 font-medium text-white/55">Tu mundo, impreso en 3D.</p>
              <div className="mt-6 flex gap-3">
                <a
                  href={WA_DEFAULT}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="foot-icon"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                </a>
                <a href="#top" aria-label="Volver arriba" className="foot-icon">
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <nav aria-label="Navegación del pie">
              <p className="foot-head">Navegación</p>
              <ul className="mt-5 grid gap-3">
                {NAV.map((l) => (
                  <li key={l.href}>
                    <a className="foot-link" href={l.href}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Catálogo">
              <p className="foot-head">Catálogo</p>
              <ul className="mt-5 grid gap-3">
                {sections.slice(0, 5).map((c) => (
                  <li key={c.id}>
                    <a className="foot-link" href="/#catalogo">
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="foot-head">Contacto</p>
              <a
                href={WA_DEFAULT}
                target="_blank"
                rel="noopener noreferrer"
                className="foot-phone mt-5 inline-block"
              >
                {PHONE_LABEL}
              </a>
              <p className="mt-4 text-sm font-medium leading-6 text-white/60">
                Pedidos y dudas por WhatsApp. Te damos precio en 24–48 h.
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/60">
                El presupuesto es gratis y sin compromiso.
              </p>
              <a href="/#pedido" className="foot-cta mt-6">
                Pedir presupuesto <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          <div className="foot-rule mt-14" />

          <a href="#top" className="foot-brand" aria-label="Mundo Print 3D, volver arriba">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mundo-print-3d-logo.png" alt="" className="foot-logo" />
            <span className="foot-word">
              Mundo<span>Print</span>3D
            </span>
          </a>

          <div className="foot-rule" />

          <div className="grid justify-items-center gap-2 pb-20 pt-8 text-center sm:pb-8">
            <p className="text-sm font-medium text-white/60">
              © {new Date().getFullYear()} Mundo Print 3D · España. Hecho a mano, capa a capa.
            </p>
            <p className="mt-1 text-sm font-semibold text-white/70">
              Hecho por{" "}
              <a
                href="https://www.foilestudio.com"
                target="_blank"
                rel="noopener"
                className="foil-credit"
              >
                <svg viewBox="0 0 20 20" aria-hidden>
                  <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" />
                </svg>
                <span className="foil-name">FoilEstudio</span>
                <span className="foil-tag">Estudio digital</span>
              </a>
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-[0.14em] text-white/60">
              <a className="hover:text-toy-yellow" href="/galeria">Vitrina</a>
              <a className="hover:text-toy-yellow" href="/#pedido">Pedir</a>
              <a className="hover:text-toy-yellow" href="#top">Volver arriba ↑</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

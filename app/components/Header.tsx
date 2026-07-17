"use client";

import { useEffect, useState } from "react";

const NAV = [
  ["Catálogo", "#catalogo"],
  ["Galería", "#galeria"],
  ["Mundial", "#mundial"],
  ["Cómo funciona", "#como-funciona"],
  ["Dudas", "#faq"],
  ["Contacto", "#encargo"],
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b-2 transition-all duration-300 ${
        scrolled || open
          ? "border-[#191430] bg-white/95 backdrop-blur"
          : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#inicio"
          aria-label="Mundo Print 3D, inicio"
          className="rounded-[6px] border-2 border-[#191430] bg-white p-0.5 shadow-[0_3px_0_#191430] transition hover:-translate-y-0.5"
        >
          <img
            src="/brand/mundo-print-3d-original.jpeg"
            alt="Mundo Print 3D"
            className="h-12 w-12 rounded-[4px] object-cover"
          />
        </a>

        <nav
          className="hidden items-center gap-6 text-sm font-bold lg:flex"
          aria-label="Navegación principal"
        >
          {NAV.map(([label, href]) => (
            <a key={href} className="transition hover:text-violet-700" href={href}>
              {label}
            </a>
          ))}
          <a className="btn-pop btn-grape !px-5 !py-2.5 text-sm" href="#encargo">
            Pide el tuyo
          </a>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="grid h-11 w-11 place-items-center rounded-[6px] border-2 border-[#191430] bg-white shadow-[0_3px_0_#191430] lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menú</span>
          <span className="flex w-5 flex-col gap-1.5">
            <span className={`h-0.5 w-full rounded bg-[#191430] transition ${open ? "translate-y-1 rotate-45" : ""}`} />
            <span className={`h-0.5 w-full rounded bg-[#191430] transition ${open ? "-translate-y-1 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open ? (
        <nav className="border-t-2 border-[#191430] bg-white px-5 py-5 lg:hidden" aria-label="Navegación móvil">
          <div className="flex flex-col text-lg font-bold">
            {[...NAV, ["Pide el tuyo", "#encargo"] as const].map(([label, href]) => (
              <a
                key={href}
                className="border-b-2 border-violet-100 py-4"
                href={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

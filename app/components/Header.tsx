"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "is-scrolled border-b border-white/10 bg-black/70 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 sm:px-10 lg:px-16">
        <a href="#inicio" aria-label="Mundo Print 3D, inicio" className="logo-tile relative z-10 rounded-2xl bg-white p-1 shadow-xl shadow-black/20">
          <img src="/brand/mundo-print-3d-original.jpeg" alt="Mundo Print 3D" className="h-14 w-14 rounded-xl object-cover" />
        </a>

        <nav className="hidden items-center gap-8 text-sm text-white/65 md:flex" aria-label="Navegación principal">
          <a className="nav-link" href="#piezas">Piezas</a>
          <a className="nav-link" href="#proceso">Cómo funciona</a>
          <a className="nav-link" href="#materiales">Materiales</a>
          <a className="nav-cta" href="#encargo">Cuéntame tu idea <span aria-hidden>↗</span></a>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/20 md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menú</span>
          <span className="flex w-5 flex-col gap-1.5">
            <span className={`h-px w-full bg-white transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-full bg-white transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 px-5 py-5 md:hidden" aria-label="Navegación móvil">
          <div className="flex flex-col text-lg">
            {[
              ["Piezas", "#piezas"],
              ["Cómo funciona", "#proceso"],
              ["Materiales", "#materiales"],
              ["Cuéntame tu idea", "#encargo"],
            ].map(([label, href]) => (
              <a key={href} className="border-b border-white/10 py-4 text-white/80" href={href} onClick={() => setOpen(false)}>{label}</a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

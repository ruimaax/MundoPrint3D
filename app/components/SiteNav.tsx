"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#como", label: "Cómo se hace" },
  { href: "/#vitrina", label: "Vitrina" },
  { href: "/#dudas", label: "Dudas" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between px-5 sm:px-8">
        <a href="/#top" className="flex items-center gap-2.5">
          <img
            src="/brand/mundo-print-3d-logo.png"
            alt=""
            className="h-9 w-9 rounded-lg object-contain"
          />
          <span className="display text-2xl leading-none">
            Mundo<span className="text-toy-red">Print</span>3D
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <a href="/#pedido" className="btn btn-red nudge !py-2.5 !px-5 text-sm">
            Pedir por WhatsApp
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-[3px] w-6 rounded bg-toy-ink transition-transform ${open ? "translate-y-[4.5px] rotate-45" : ""}`}
          />
          <span
            className={`block h-[3px] w-6 rounded bg-toy-ink transition-transform ${open ? "-translate-y-[4.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav className="border-t border-toy-ink/10 bg-toy-paper px-5 pb-6 pt-2 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="display block py-3 text-2xl"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#pedido"
            onClick={() => setOpen(false)}
            className="btn btn-red mt-3 w-full"
          >
            Pedir por WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}

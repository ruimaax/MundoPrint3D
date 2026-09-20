"use client";

import { useEffect, useState } from "react";
import { SEED_CATALOG, type Catalog } from "./catalog";

// Lee el catálogo editable (/api/catalog, servido por el worker de
// Cloudflare). Mientras llega, y si falla (p. ej. con `next dev`, que no
// tiene API), se usa la semilla, así la página nunca sale vacía.
let pending: Promise<Catalog | null> | null = null;

function loadCatalog(): Promise<Catalog | null> {
  pending ??= fetch("/api/catalog", { cache: "no-store" })
    .then((r) => (r.ok ? (r.json() as Promise<Catalog>) : null))
    .then((c) => (c && Array.isArray(c.sections) ? c : null))
    .catch(() => null);
  return pending;
}

export function useCatalog(): Catalog {
  const [catalog, setCatalog] = useState<Catalog>(SEED_CATALOG);
  useEffect(() => {
    let alive = true;
    loadCatalog().then((c) => {
      if (alive && c) setCatalog(c);
    });
    return () => {
      alive = false;
    };
  }, []);
  return catalog;
}

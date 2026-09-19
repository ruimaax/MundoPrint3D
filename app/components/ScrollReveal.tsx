"use client";

import { useEffect } from "react";

// Hace aparecer con animación todo lo marcado con data-reveal cuando entra en
// pantalla. Solo es una entrada, no hay animaciones ligadas al scroll.
// Sin JS (o con movimiento reducido) todo se ve desde el principio: los
// elementos solo se ocultan cuando <html> lleva la clase reveal-ready.
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const watch = (scope: ParentNode) =>
      scope.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));

    watch(document);
    root.classList.add("reveal-ready");

    // Elementos que aparecen después (p. ej. al filtrar la vitrina).
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]")) io.observe(node);
          watch(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

// Un único listener global: todos los ojos marcados con data-eye (los de
// cualquier mini funko de la página) siguen al cursor.
export default function FunkoEyes() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const eyes = Array.from(document.querySelectorAll<SVGCircleElement>("[data-eye]"));
    if (eyes.length === 0) return;

    let raf = 0;
    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const eye of eyes) {
          const rect = eye.getBoundingClientRect();
          if (rect.bottom < -40 || rect.top > window.innerHeight + 40) continue;
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = event.clientX - cx;
          const dy = event.clientY - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const reach = Math.min(3, dist / 40);
          eye.setAttribute(
            "transform",
            `translate(${((dx / dist) * reach).toFixed(2)} ${((dy / dist) * reach).toFixed(2)})`,
          );
        }
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

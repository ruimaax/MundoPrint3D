"use client";

import { useEffect, useRef, useState } from "react";
import { categories } from "../data/products";
import ProductArt from "./ProductArt";

const COUNT = categories.length;

// Vitrina giratoria: las tarjetas orbitan alrededor del centro. La del medio
// se agranda y da un bote; las de los lados se inclinan hacia dentro.
export default function CategoryHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragRef = useRef<{ x: number; moved: boolean } | null>(null);

  const go = (direction: 1 | -1) => setActive((current) => (current + direction + COUNT) % COUNT);

  // Gira sola hasta que el visitante interactúa con ella.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % COUNT), 1800);
    return () => window.clearInterval(timer);
  }, [paused]);

  const onPointerDown = (event: React.PointerEvent) => {
    dragRef.current = { x: event.clientX, moved: false };
    setPaused(true);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.moved) return;
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > 40) {
      go(dx < 0 ? 1 : -1);
      drag.moved = true;
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      className="carousel-stage"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <button type="button" className="cat-arrow left" onClick={() => go(-1)} aria-label="Categoría anterior">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button type="button" className="cat-arrow right" onClick={() => go(1)} aria-label="Categoría siguiente">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="carousel-track">
        {categories.map((category, index) => {
          // Distancia con la tarjeta central, dando la vuelta por el camino corto.
          let offset = index - active;
          if (offset > COUNT / 2) offset -= COUNT;
          if (offset < -COUNT / 2) offset += COUNT;

          const distance = Math.abs(offset);
          const isActive = distance === 0;

          return (
            <a
              key={category.id}
              className={`cat-card ${category.dark ? "is-dark" : ""} ${isActive ? "is-active" : ""}`}
              style={{
                background: category.bg,
                transform: `translate(-50%, -50%) translateX(${offset * 15.5}rem) translateY(${distance * 0.7}rem) rotateY(${offset * -22}deg) scale(${isActive ? 1 : 0.82 - distance * 0.04})`,
                zIndex: COUNT - distance,
                opacity: distance > 2 ? 0 : 1,
                pointerEvents: distance > 2 ? "none" : "auto",
                padding: category.image ? 0 : undefined,
              }}
              href={`/?idea=${encodeURIComponent(category.orderTitle)}#encargo`}
              tabIndex={distance > 2 ? -1 : undefined}
              aria-hidden={distance > 2}
              onClick={(event) => {
                // Fuera del centro, el primer clic solo trae la tarjeta al frente.
                if (!isActive) {
                  event.preventDefault();
                  setActive(index);
                }
              }}
            >
              {category.image ? (
                <>
                  <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="sr-only">{category.title} - Ver colección</span>
                </>
              ) : (
                <>
                  <div className={`cat-art ${isActive ? "is-active" : ""}`} key={isActive ? "on" : "off"}>
                    <ProductArt id={category.id} plain />
                  </div>
                  <h2 className="cat-title font-display">{category.title}</h2>
                  <span className="cat-cta">Ver colección</span>
                </>
              )}
            </a>
          );
        })}
      </div>

      <div className="carousel-dots">
        {categories.map((category, index) => (
          <button
            key={category.id}
            type="button"
            className={`cat-dot ${index === active ? "is-active" : ""}`}
            aria-label={`Ver ${category.title}`}
            aria-current={index === active}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  );
}

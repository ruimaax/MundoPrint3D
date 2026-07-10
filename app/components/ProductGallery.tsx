"use client";

import { useReducedMotion } from "framer-motion";
import { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { products } from "../data/products";

const AUTOPLAY_DELAY = 5200;

export default function ProductGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const goTo = useCallback((index: number) => {
    const length = products.length;
    setActiveIndex((index + length) % length);
  }, []);

  const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    if (paused || prefersReducedMotion || products.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % products.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [paused, prefersReducedMotion]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  };

  return (
    <section id="piezas" className="gallery-lab relative overflow-hidden border-t border-white/10 px-5 py-24 sm:px-10 lg:px-16 lg:py-36">
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="section-label">Piezas creadas</p>
            <h2 className="headline-display max-w-3xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
              Todo lo que va saliendo del taller, en movimiento.
            </h2>
          </div>
          <a href="#encargo" className="arrow-link self-start md:self-auto">
            Quiero algo parecido <span aria-hidden>↗</span>
          </a>
        </div>

        <div
          className={`showcase-carousel mt-14 ${paused ? "is-paused" : ""}`}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Piezas creadas"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
          }}
        >
          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
            >
              {products.map((product, index) => (
                <article
                  key={product.title}
                  className={`carousel-slide ${index === activeIndex ? "is-active" : ""}`}
                  aria-hidden={index !== activeIndex}
                >
                  <img src={product.image} alt={product.title} />
                  <div className="carousel-shade" />
                  <div className="carousel-slide-meta">
                    <div className="carousel-index" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="relative z-10 max-w-xl">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-filament">
                        {product.category}
                      </p>
                      <h3 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                        {product.title}
                      </h3>
                      <p className="mt-4 max-w-md text-sm leading-6 text-white/65 sm:text-base">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="carousel-topline" aria-hidden>
              <span>MUNDO / ARCHIVO DE PIEZAS</span>
              <span>{String(activeIndex + 1).padStart(2, "0")} — {String(products.length).padStart(2, "0")}</span>
            </div>

            <div className="carousel-controls">
              <button type="button" onClick={previous} aria-label="Ver pieza anterior">
                <span aria-hidden>←</span>
              </button>
              <button type="button" onClick={next} aria-label="Ver pieza siguiente">
                <span aria-hidden>→</span>
              </button>
            </div>

            <div className="carousel-timer" aria-hidden>
              <span key={activeIndex} className="carousel-timer-fill" />
            </div>
          </div>

          <div className="carousel-rail" role="tablist" aria-label="Seleccionar una pieza">
            {products.map((product, index) => (
              <button
                key={product.title}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Mostrar ${product.title}`}
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => goTo(index)}
              >
                <span className="carousel-thumb">
                  <img src={product.image} alt="" />
                </span>
                <span className="min-w-0 text-left">
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <strong>{product.title}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-xs uppercase tracking-[0.16em] text-white/30">
          Usa las flechas del teclado o los controles para explorar
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="upload-slot rounded-[2rem] border border-dashed border-white/20 p-7 sm:p-9">
            <div className="upload-plus mb-8 grid h-11 w-11 place-items-center rounded-full text-xl text-violet-200">+</div>
            <h3 className="text-xl font-semibold">Espacio listo para la próxima pieza</h3>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/45">
              La galería queda preparada para añadir nuevas fotos, medidas,
              materiales y colores a medida que crezca el catálogo.
            </p>
          </div>
          <div className="project-cta-card relative overflow-hidden rounded-[2rem] p-7 sm:p-9">
            <p className="text-xs uppercase tracking-[0.22em] text-white/60">¿No lo ves aquí?</p>
            <h3 className="mt-8 max-w-md text-2xl font-semibold tracking-tight">Precisamente por eso hacemos encargos personalizados.</h3>
            <a className="mt-7 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-950 transition hover:bg-filament" href="#encargo">Empezar un proyecto</a>
          </div>
        </div>
      </div>
    </section>
  );
}

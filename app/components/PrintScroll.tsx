"use client";

import {
  MotionValue,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const BG_COLOR = "#050505";
const FRAME_COUNT = 80;
const STATIC_FRAME_PROGRESS = 0.75;

function frameUrl(index: number) {
  return `/video-split/frame_${String(index + 1).padStart(3, "0")}.webp`;
}

function loadFrame(index: number): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();

    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);

    image.src = frameUrl(index);
  });
}

type StoryOverlayProps = {
  align: "center" | "left" | "right";
  eyebrow?: string;
  heading: string;
  body?: string;
  cta?: boolean;
  progress: MotionValue<number>;
  range: [number, number, number] | [number, number, number, number];
  opacity: number[];
};

function StoryOverlay({
  align,
  eyebrow,
  heading,
  body,
  cta,
  progress,
  range,
  opacity,
}: StoryOverlayProps) {
  const sectionOpacity = useTransform(progress, range, opacity);
  const y = useTransform(progress, range, opacity.map((value) => (value ? 0 : 24)));

  const alignment =
    align === "left"
      ? "items-start text-left"
      : align === "right"
        ? "items-end text-right"
        : "items-center text-center";

  const position =
    align === "left"
      ? "justify-center px-6 sm:px-12 lg:px-20"
      : align === "right"
        ? "justify-center px-6 sm:px-12 lg:px-20"
        : "justify-center px-6";

  return (
    <motion.section
      aria-hidden
      className={`pointer-events-none absolute inset-0 flex items-center ${position}`}
      style={{ opacity: sectionOpacity }}
    >
      <motion.div
        className={`flex w-full max-w-6xl flex-col ${alignment}`}
        style={{ y }}
      >
        {eyebrow ? (
          <p className="story-kicker mb-5 text-xs font-medium uppercase tracking-[0.28em] text-filament">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="story-title max-w-4xl text-balance text-5xl font-semibold tracking-[-0.055em] text-white/90 sm:text-7xl lg:text-8xl">
          {heading}
        </h1>

        {body ? (
          <p className="story-copy mt-6 max-w-md text-base leading-7 text-white/65 sm:text-lg">
            {body}
          </p>
        ) : null}

        {cta ? (
          <a
            className="cta-orbit pointer-events-auto mt-8 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-filament focus:ring-offset-2 focus:ring-offset-void"
            href="#encargo"
          >
            Cuéntame tu idea
          </a>
        ) : null}
      </motion.div>
    </motion.section>
  );
}

export default function PrintScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameCountRef = useRef(FRAME_COUNT);
  const currentFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [expectedFrames] = useState(FRAME_COUNT);
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 86,
    damping: 24,
    mass: 0.42,
  });

  const frameIndexes = useMemo(() => {
    const count = prefersReducedMotion ? 1 : FRAME_COUNT;
    const staticFrame = Math.round((FRAME_COUNT - 1) * STATIC_FRAME_PROGRESS);

    return Array.from({ length: count }, (_, index) =>
      prefersReducedMotion ? staticFrame : index,
    );
  }, [prefersReducedMotion]);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const image =
      imagesRef.current[index] ??
      imagesRef.current.find((candidate): candidate is HTMLImageElement =>
        Boolean(candidate),
      );

    if (!canvas || !image) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = Math.max(1, Math.floor(rect.width));
    const displayHeight = Math.max(1, Math.floor(rect.height));
    const pixelWidth = Math.floor(displayWidth * dpr);
    const pixelHeight = Math.floor(displayHeight * dpr);

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.fillStyle = BG_COLOR;
    context.fillRect(0, 0, displayWidth, displayHeight);

    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    const scale = Math.min(displayWidth / imageWidth, displayHeight / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const offsetX = (displayWidth - drawWidth) / 2;
    const offsetY = (displayHeight - drawHeight) / 2;

    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  useEffect(() => {
    let cancelled = false;

    imagesRef.current = [];
    currentFrameRef.current = -1;
    setLoadedFrames(0);
    setIsReady(false);

    async function preloadFrames() {
      frameCountRef.current = FRAME_COUNT;
      imagesRef.current = Array(FRAME_COUNT).fill(null);

      const firstIndex = frameIndexes[0];
      const firstImage = await loadFrame(firstIndex);
      if (cancelled) {
        return;
      }

      imagesRef.current[firstIndex] = firstImage;
      setLoadedFrames(1);
      if (firstImage) {
        setIsReady(true);
        drawFrame(firstIndex);
      }

      await Promise.all(
        frameIndexes.slice(1).map(async (frameIndex) => {
          const image = await loadFrame(frameIndex);
          if (!cancelled) {
            imagesRef.current[frameIndex] = image;
            setLoadedFrames((count) => count + 1);
          }
        }),
      );
    }

    preloadFrames();

    return () => {
      cancelled = true;
    };
  }, [drawFrame, frameIndexes]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      const progress = prefersReducedMotion ? 0 : smoothProgress.get();
      const frameIndex = prefersReducedMotion
        ? Math.round((frameCountRef.current - 1) * STATIC_FRAME_PROGRESS)
        : Math.round(progress * (frameCountRef.current - 1));

      drawFrame(frameIndex);
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [drawFrame, isReady, prefersReducedMotion, smoothProgress]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (!isReady || prefersReducedMotion) {
      return;
    }

    const frameIndex = Math.min(
      frameCountRef.current - 1,
      Math.max(0, Math.round(latest * (frameCountRef.current - 1))),
    );

    if (frameIndex === currentFrameRef.current) {
      return;
    }

    currentFrameRef.current = frameIndex;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
  });

  const loadingProgress = Math.min(
    100,
    Math.round((loadedFrames / expectedFrames) * 100),
  );

  if (prefersReducedMotion) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-void">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full bg-void"
          aria-label="Objeto impreso en 3D terminado"
        />

        {!isReady ? (
          <div className="absolute inset-0 z-20 grid place-items-center bg-void">
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span className="h-5 w-5 animate-spin rounded-full border border-white/20 border-t-filament" />
              <span>{loadingProgress}%</span>
            </div>
          </div>
        ) : null}

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-filament">
            Mundo Print 3D
          </p>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white/90 sm:text-7xl lg:text-8xl">
            Tu mundo, impreso.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/60 sm:text-lg">
            Diseño e impresión 3D a medida para convertir referencias,
            bocetos e ideas en piezas reales.
          </p>
          <a
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-filament px-6 text-sm font-semibold text-black transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-filament focus:ring-offset-2 focus:ring-offset-void"
            href="#encargo"
          >
            Cuéntame tu idea
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="inicio" ref={containerRef} className="relative h-[650vh] bg-void" style={{ position: "relative" }}>
      <div className="hero-stage sticky top-0 h-screen overflow-hidden bg-void">
        <canvas
          ref={canvasRef}
          className="h-screen w-full bg-void"
          aria-label="Animación scroll-linked de una pieza impresa en 3D"
        />

        <div className="hero-wash pointer-events-none absolute inset-0" aria-hidden />
        <div className="hero-scanlines pointer-events-none absolute inset-0" aria-hidden />
        <span className="hero-corner hero-corner-tl" aria-hidden />
        <span className="hero-corner hero-corner-tr" aria-hidden />
        <span className="hero-corner hero-corner-bl" aria-hidden />
        <span className="hero-corner hero-corner-br" aria-hidden />

        {!isReady ? (
          <div className="absolute inset-0 z-20 grid place-items-center bg-void">
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span className="h-5 w-5 animate-spin rounded-full border border-white/20 border-t-filament" />
              <span>{loadingProgress}%</span>
            </div>
          </div>
        ) : null}

        <div className="absolute inset-0 z-10">
          <StoryOverlay
            align="center"
            heading="Tu mundo, impreso."
            body="Diseño e impresión 3D a medida para convertir referencias, bocetos e ideas en piezas reales."
            progress={smoothProgress}
            range={[0, 0.12, 0.22]}
            opacity={[1, 1, 0]}
          />

          <StoryOverlay
            align="left"
            heading="Capa a capa."
            body="Cada pieza se fabrica despacio, con el material, el color y la resistencia que necesita tu idea."
            progress={smoothProgress}
            range={[0.18, 0.3, 0.43]}
            opacity={[0, 1, 0]}
          />

          <StoryOverlay
            align="right"
            heading="Hecho para ti."
            body="Regalos, rótulos, recambios, prototipos o series pequeñas. Si puede modelarse, podemos hablarlo."
            progress={smoothProgress}
            range={[0.48, 0.6, 0.74]}
            opacity={[0, 1, 0]}
          />

          <StoryOverlay
            align="center"
            heading="¿Qué tienes en mente?"
            body="Manda una foto, pega un enlace o descríbelo con tus palabras. Con eso basta para empezar."
            cta
            progress={smoothProgress}
            range={[0.78, 0.9, 1]}
            opacity={[0, 1, 1]}
          />
        </div>

        <div className="hero-status pointer-events-none absolute bottom-7 left-6 z-10 hidden items-center gap-3 sm:flex lg:left-16" aria-hidden>
          <span className="status-dot" />
          <span>TALLER ACTIVO</span>
          <span className="text-white/25">/</span>
          <span className="text-white/40">CAPAS EN PROCESO</span>
        </div>

        <div className="hero-axis pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 lg:block" aria-hidden>
          <span>Z</span><i /><span>120</span><i /><span>060</span><i /><span>000</span>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 h-10 w-px -translate-x-1/2 overflow-hidden bg-white/10">
          <motion.div
            className="h-full w-full origin-top bg-filament"
            style={{ scaleY: smoothProgress }}
          />
        </div>
      </div>
    </section>
  );
}

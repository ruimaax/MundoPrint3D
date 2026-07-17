"use client";

import { useEffect, useState } from "react";

// Número del taller (España). Cambiar aquí cuando pasemos a los datos reales
// del cliente.
const PHONE = "34623173625";
const MESSAGE = "¡Hola! Vengo de la web y quiero pedir un funko personalizado 🙂";

const HREF = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

const INK = "#191430";

export default function WhatsAppBubble() {
  const [open, setOpen] = useState(false);

  // El bocadillo saluda solo a los pocos segundos de entrar.
  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="wa-dock">
      {open ? (
        <div className="wa-bubble">
          <button
            type="button"
            className="wa-close"
            aria-label="Cerrar mensaje"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <p className="wa-bubble-text">
            ¿Dudas con tu funko? Escríbeme por WhatsApp y lo vemos.
          </p>
        </div>
      ) : null}

      <a
        className="wa-launcher"
        href={HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp al taller"
        onMouseEnter={() => setOpen(true)}
      >
        {/* La mascota asoma la cabeza por detrás del botón. */}
        <span className="wa-peek" aria-hidden>
          <svg viewBox="0 0 90 40">
            <rect x="17" y="8" width="56" height="46" rx="14" fill="#e9d5ff" stroke={INK} strokeWidth="4" />
            <path d="M17 26 C17 12 29 6 45 6 C61 6 73 12 73 26 C65 20 55 18 45 18 C35 18 25 20 17 26 Z" fill={INK} />
            <circle cx="34" cy="31" r="4" fill={INK} />
            <circle cx="56" cy="31" r="4" fill={INK} />
          </svg>
        </span>
        <svg className="wa-phone" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.95L0 24l6.3-1.65a11.9 11.9 0 0 0 5.74 1.46h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.42-8.43zM12.05 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.51-5.28c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.9 7c0 5.45-4.44 9.88-9.9 9.88zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35z" />
        </svg>
      </a>
    </div>
  );
}

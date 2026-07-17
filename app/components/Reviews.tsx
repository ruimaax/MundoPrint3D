import MiniFunko from "./MiniFunko";

// Perfil de Google Business del taller. Cuando tengamos el enlace real del
// cliente, se pone aquí y los dos botones apuntan solos.
//   - PROFILE_URL: enlace público del perfil (para leer las reseñas)
//   - REVIEW_URL: enlace directo a "escribir reseña"
// Mientras esté vacío, la sección invita a pedir por WhatsApp en su lugar.
const PROFILE_URL = "";
const REVIEW_URL = "";

export default function Reviews() {
  const configured = Boolean(PROFILE_URL);

  return (
    <section className="border-y-2 border-[#191430] bg-[#eeeaff] px-5 py-16 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center" data-reveal>
        <div className="google-badge">
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
            <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6z" />
            <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9a7 7 0 0 1-10.4-3.7H1.7v3a12 12 0 0 0 10.3 6.4z" />
            <path fill="#FBBC05" d="M5.5 14.6a7.2 7.2 0 0 1 0-4.6v-3H1.7a12 12 0 0 0 0 10.6l3.8-3z" />
            <path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.7 6.4l3.8 3A7 7 0 0 1 12 4.8z" />
          </svg>
          <span className="font-display text-sm font-extrabold">Reseñas en Google</span>
        </div>

        <h2 className="font-display max-w-2xl text-balance text-4xl font-extrabold sm:text-5xl">
          Lo que dicen quienes ya tienen el suyo
        </h2>
        <p className="max-w-xl leading-7 text-[#191430]/70">
          Nada de testimonios inventados: las opiniones están en el perfil de
          Google del taller, tal cual las escribieron.
        </p>

        {configured ? (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a className="btn-pop btn-white" href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
              Leer las reseñas en Google
            </a>
            <a className="btn-pop btn-grape" href={REVIEW_URL} target="_blank" rel="noopener noreferrer">
              Dejar mi reseña
            </a>
          </div>
        ) : (
          <div className="reviews-pending">
            <MiniFunko variant="guia" className="w-16 shrink-0" />
            <p className="text-left text-sm leading-6 text-[#191430]/70">
              <strong className="font-display block text-base text-[#191430]">
                Pendiente del enlace del perfil de Google
              </strong>
              En cuanto me pases el enlace del perfil de Google Business, esta
              sección enseña las reseñas reales y el botón para dejar una nueva.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

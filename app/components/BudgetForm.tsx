"use client";

import { useState } from "react";
import { GENERIC_FORM, formOf, inkOn, type Question, type SectionForm } from "../data/catalog";
import { useCatalog } from "../data/useCatalog";
import { waLink } from "../data/contact";

// Formulario de pedido: compone el mensaje y lo abre en WhatsApp, donde se
// cierra el trato. A la vez manda una copia al worker (/api/pedido), que la
// envía por correo al taller; si eso falla, WhatsApp se abre igual.
// El paso 2 (las preguntas de cada sección) se edita desde /admin.

// Las secciones del catálogo (editables desde /admin) más "Otro", para ideas
// que aún no están en él.
const OTRO_FORM: SectionForm = {
  ...GENERIC_FORM,
  questions: GENERIC_FORM.questions.map((q) => ({
    ...q,
    placeholder: "Cuéntanos tu idea aunque no la veas en el catálogo: qué es, para qué, medidas, colores…",
  })),
};
const OTRO = { id: "otro", title: "Otro", order: "Algo que no está en el catálogo", color: "#201436", form: OTRO_FORM };

export default function BudgetForm() {
  const { sections } = useCatalog();
  const OPTIONS = [
    ...sections.map((s) => ({ id: s.id, title: s.title, order: s.title, color: s.color, form: formOf(s) })),
    OTRO,
  ];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  // Campo trampa, oculto: solo lo rellenan los bots.
  const [website, setWebsite] = useState("");
  const [typeId, setTypeId] = useState(OPTIONS[0].id);
  // Respuestas del paso 2, por sección y pregunta ("mascota.como-es"), para
  // no perder lo escrito al cambiar de sección y volver.
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [date, setDate] = useState("");
  const [noRush, setNoRush] = useState(false);

  const type = OPTIONS.find((c) => c.id === typeId) ?? OPTIONS[0];
  const { title: stepTitle, questions } = type.form;
  const today = new Date().toISOString().slice(0, 10);

  const valueOf = (q: Question) => answers[`${type.id}.${q.id}`] ?? defaultValue(q);
  const setValue = (q: Question, value: string) =>
    setAnswers((a) => ({ ...a, [`${type.id}.${q.id}`]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateLabel = date
      ? new Date(`${date}T00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
      : null;
    const when = noRush ? "Sin prisa" : dateLabel;

    // Copia por correo, en segundo plano. keepalive: que no se corte al
    // abrirse WhatsApp en otra pestaña o app.
    fetch("/api/pedido", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        section: type.order,
        color: type.color,
        answers: questions.map((q) => ({ label: q.label, value: valueOf(q).trim() })),
        when: when ?? "",
        website,
      }),
    }).catch(() => {});

    const message = whatsAppMessage({
      name: name.trim(),
      section: type.id === OTRO.id ? null : type.title,
      answers: questions.map((q) => ({ question: q, value: valueOf(q).trim() })),
      noRush,
      date: noRush ? null : dateLabel,
    });
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  };

  // Los campos cortos (texto y desplegable) van de dos en dos; los largos y
  // los que se quedan solos ocupan todo el ancho.
  const half = halfWidth(questions);

  return (
    <form onSubmit={handleSubmit} className="order-form relative grid gap-7">
      {/* 1 · Qué quieres */}
      <fieldset className="grid gap-5">
        <legend className="form-step">
          <span>1</span> ¿Qué quieres?
        </legend>
        <div className="pick-grid">
          {OPTIONS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="pick"
              data-active={cat.id === typeId}
              aria-pressed={cat.id === typeId}
              onClick={() => setTypeId(cat.id)}
              style={
                cat.id === typeId
                  ? ({ background: cat.color, color: inkOn(cat.color), "--dot": inkOn(cat.color) } as React.CSSProperties)
                  : ({ "--dot": cat.color } as React.CSSProperties)
              }
            >
              <span className="pick-dot" aria-hidden />
              {cat.title}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 2 · Preguntas de la sección */}
      {questions.length > 0 && (
        <fieldset key={typeId} className="swap-in grid gap-5 sm:grid-cols-2">
          <legend className="form-step">
            <span>2</span> {stepTitle}
          </legend>
          {questions.map((q, i) => (
            <div key={q.id} className={half[i] ? "" : "sm:col-span-2"}>
              <Field question={q} value={valueOf(q)} onChange={(v) => setValue(q, v)} />
            </div>
          ))}
        </fieldset>
      )}

      {/* 3 · Tus datos */}
      <fieldset className="grid gap-5">
        <legend className="form-step">
          <span>{questions.length > 0 ? 3 : 2}</span> Tus datos
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Tu nombre</span>
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="¿Cómo te llamas?"
              autoComplete="given-name"
              required
            />
          </label>

          <label className="block">
            <span className="field-label">Tu móvil</span>
            <input
              className="input"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej.: 644 12 34 56"
              autoComplete="tel"
              maxLength={30}
              required
              pattern="[\+0-9 \(\)\-]{9,}"
              title="Escribe un número de teléfono válido (mínimo 9 cifras)"
            />
          </label>

          <div className="sm:col-span-2">
            <label className="block sm:max-w-[calc(50%-0.625rem)]">
              <span className="field-label">¿Para cuándo?</span>
              <input
                className="input disabled:opacity-40"
                type="date"
                min={today}
                value={date}
                disabled={noRush}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="pick mt-2.5"
              data-active={noRush}
              aria-pressed={noRush}
              onClick={() => setNoRush((v) => !v)}
            >
              {noRush ? "✓ " : ""}Sin prisa
            </button>
          </div>
        </div>
      </fieldset>

      {/* trampa para bots: fuera de la vista y del teclado */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      <div className="send-row">
        <button type="submit" className="btn btn-green send-btn w-full text-lg sm:w-auto">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.5-.6c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.5 3.9.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.6Z" />
          </svg>
          Enviar por WhatsApp
        </button>
        <p className="w-full text-center text-sm font-semibold leading-5 text-toy-ink/60 sm:w-auto sm:text-left">
          Sin compromiso<span className="sm:hidden"> · </span>
          <br className="hidden sm:block" />
          Respuesta en 24–48 h
        </p>
      </div>
    </form>
  );
}

// Mensaje de WhatsApp escrito como lo escribiría una persona, no como una
// ficha: saludo, qué quiere en una frase, los detalles en lista y la fecha.
//
//   ¡Hola! 👋 Soy Adrian y os escribo desde la web.
//
//   Quería pedir presupuesto para *Funkos de la Selección*: serían *3 figuras*.
//
//   Os cuento:
//   • *Jugador(es):* Mbappé
//   • *Cómo es y qué lleva puesto:* …
//
//   No tengo prisa, cuando os venga bien.
//
//   ¡Muchas gracias!
function whatsAppMessage({
  name,
  section,
  answers,
  noRush,
  date,
}: {
  name: string;
  /** null = "Otro": algo que no está en el catálogo. */
  section: string | null;
  answers: { question: Question; value: string }[];
  noRush: boolean;
  date: string | null;
}): string {
  // Un "Nº de figuras" se mete en la frase principal ("serían 3 figuras").
  const count = answers.find((a) => a.question.kind === "count" && countUnit(a.question.label));
  const amount = count ? `${count.value} ${countUnit(count.question.label, Number(count.value))}` : null;

  const want = section
    ? `Quería pedir presupuesto para *${section}*${amount ? `: ${Number(count!.value) === 1 ? "sería" : "serían"} *${amount}*` : ""}.`
    : `Quería pedir presupuesto para una idea que no he visto en el catálogo${amount ? ` (${amount})` : ""}.`;

  const rest = answers.filter((a) => a !== count && a.value);
  // Las preguntas abiertas ("Cuéntanos qué necesitas") van como texto
  // corrido; el resto, en lista con la etiqueta en boca del cliente.
  const free = rest.filter((a) => isOpenQuestion(a.question.label)).map((a) => a.value);
  const details = rest
    .filter((a) => !isOpenQuestion(a.question.label))
    .map((a) => `• *${firstPerson(a.question.label)}:* ${a.value}`);

  const blocks = [
    name ? `¡Hola! 👋 Soy ${name} y os escribo desde la web.` : "¡Hola! 👋 Os escribo desde la web.",
    want,
    details.length ? ["Os cuento:", ...details].join("\n") : null,
    ...free.map((text, i) => (i === 0 && !details.length ? `Os cuento: ${text}` : text)),
    noRush ? "No tengo prisa, cuando os venga bien." : date ? `Lo necesitaría para el *${date}*.` : null,
    "¡Muchas gracias!",
  ];
  return blocks.filter(Boolean).join("\n\n");
}

// "Cuéntanos qué necesitas", "¿Algo más?": preguntas que no sirven de etiqueta.
function isOpenQuestion(label: string): boolean {
  return /^(¿|cu[eé]nta)/i.test(label.trim()) || label.trim().endsWith("?");
}

// Las etiquetas hablan al cliente ("Tu mascota"); en su mensaje, "Mi mascota".
function firstPerson(label: string): string {
  return label.replace(/^tus\b/i, "Mis").replace(/^tu\b/i, "Mi");
}

// "Nº de figuras" → "figuras" (o "figura" si es una). null si la pregunta no
// sigue ese formato y hay que ponerla como un detalle más.
function countUnit(label: string, n = 2): string | null {
  const m = /^n(?:º|°|o|\.)\s*(?:de\s+)?(.+)$/i.exec(label.trim());
  if (!m) return null;
  const unit = m[1].toLowerCase();
  return n === 1 && unit.endsWith("s") ? unit.slice(0, -1) : unit;
}

function defaultValue(q: Question): string {
  if (q.kind === "count") return "1";
  if (q.kind === "choice") return q.options?.[0] ?? "";
  return "";
}

function halfWidth(questions: Question[]): boolean[] {
  const out = questions.map(() => false);
  let run: number[] = [];
  const flush = () => {
    // En una tanda impar, la última se queda sola y va a lo ancho.
    const paired = run.length % 2 === 0 ? run : run.slice(0, -1);
    paired.forEach((i) => (out[i] = true));
    run = [];
  };
  questions.forEach((q, i) => {
    if (q.kind === "short" || q.kind === "choice") run.push(i);
    else flush();
  });
  flush();
  return out;
}

function Field({ question: q, value, onChange }: { question: Question; value: string; onChange: (v: string) => void }) {
  if (q.kind === "count") {
    const n = Number(value) || 1;
    return (
      <div>
        <span className="field-label block">{q.label}</span>
        <div className="stepper mt-[0.45rem]">
          <button type="button" aria-label={`${q.label}: uno menos`} onClick={() => onChange(String(Math.max(1, n - 1)))}>
            −
          </button>
          <output key={n} className="bump" aria-live="polite">
            {n}
          </output>
          <button type="button" aria-label={`${q.label}: uno más`} onClick={() => onChange(String(Math.min(50, n + 1)))}>
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <label className="block">
      <span className="field-label">{q.label}</span>
      {q.kind === "choice" ? (
        <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
          {(q.options ?? []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : q.kind === "long" ? (
        <textarea
          className="input min-h-[8.5rem] resize-y sm:min-h-24"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          required={q.required}
        />
      ) : (
        <input
          className="input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          required={q.required}
        />
      )}
    </label>
  );
}

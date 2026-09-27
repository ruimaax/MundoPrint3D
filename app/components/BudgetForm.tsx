"use client";

import { useState } from "react";
import { GENERIC_FORM, formOf, inkOn, type Question, type SectionForm } from "../data/catalog";
import { useCatalog } from "../data/useCatalog";
import { waLink } from "../data/contact";

// Formulario de pedido: compone el mensaje y lo abre en WhatsApp, donde se
// cierra el trato. Sin backend.
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
    const when = noRush
      ? "Sin prisa"
      : date
        ? new Date(`${date}T00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
        : null;

    const lines: (string | null | false | undefined)[] = [
      "¡Hola! Quiero pedir presupuesto desde la web.",
      name.trim() && `Soy ${name.trim()}.`,
      "",
      `*Quiero:* ${type.order}`,
      ...questions.map((q) => {
        const v = valueOf(q).trim();
        return v ? `*${q.label}:* ${v}` : null;
      }),
      when && `*Lo necesito para:* ${when}`,
    ];

    const message = lines
      .filter((l): l is string => typeof l === "string")
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  };

  // Los campos cortos (texto y desplegable) van de dos en dos; los largos y
  // los que se quedan solos ocupan todo el ancho.
  const half = halfWidth(questions);

  return (
    <form onSubmit={handleSubmit} className="order-form grid gap-7">
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

          <div>
            <label className="block">
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

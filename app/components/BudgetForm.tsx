"use client";

import { useState } from "react";
import { inkOn } from "../data/catalog";
import { useCatalog } from "../data/useCatalog";
import { waLink } from "../data/contact";

// Formulario de pedido: compone el mensaje y lo abre en WhatsApp, donde se
// cierra el trato. Sin backend.

// Tipos que son figuras: para ellos se muestran las preguntas de funko.
const FUNKO_IDS = ["funko-personalizado", "funko-seleccion", "funko-semanasanta", "mascota"];

// Las secciones del catálogo (editables desde /admin) más "Otro", para ideas
// que aún no están en él.
const OTRO = { id: "otro", title: "Otro", order: "Algo que no está en el catálogo", color: "#201436" };

export default function BudgetForm() {
  const { sections } = useCatalog();
  const OPTIONS = [
    ...sections.map((s) => ({ id: s.id, title: s.title, order: s.title, color: s.color })),
    OTRO,
  ];

  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState(OPTIONS[0].id);

  const [figures, setFigures] = useState(1);
  const [who, setWho] = useState("");

  // Campos propios de cada línea de funko.
  const [pet, setPet] = useState("");
  const [brotherhood, setBrotherhood] = useState("");
  const [role, setRole] = useState("Nazareno");
  const [player, setPlayer] = useState("");

  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [noRush, setNoRush] = useState(false);

  const type = OPTIONS.find((c) => c.id === typeId) ?? OPTIONS[0];
  const isFunko = FUNKO_IDS.includes(typeId);
  const today = new Date().toISOString().slice(0, 10);

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
      isFunko && `*Figuras:* ${figures}`,
      typeId === "mascota" && pet.trim() && `*Mascota:* ${pet.trim()}`,
      typeId === "funko-semanasanta" && `*Figura:* ${role}`,
      typeId === "funko-semanasanta" && brotherhood.trim() && `*Hermandad:* ${brotherhood.trim()}`,
      typeId === "funko-seleccion" && player.trim() && `*Jugador(es):* ${player.trim()}`,
      isFunko && who.trim() && `*Cómo es / qué lleva:* ${who.trim()}`,
      !isFunko && details.trim() && `*Mi idea:* ${details.trim()}`,
      when && `*Lo necesito para:* ${when}`,
    ];

    const message = lines
      .filter((l): l is string => typeof l === "string")
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="order-form grid gap-7">
      {/* 1 · Qué quieres */}
      <fieldset className="grid gap-5">
        <legend className="form-step">
          <span>1</span> ¿Qué quieres?
        </legend>
        <div className="flex flex-wrap gap-2">
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

      {/* 2 · Detalles de la figura */}
      {isFunko ? (
        <fieldset key={typeId} className="swap-in grid gap-5">
          <legend className="form-step">
            <span>2</span> Tu figura
          </legend>

          <div>
            <span className="field-label block">Nº de figuras</span>
            <div className="stepper mt-[0.45rem]">
              <button
                type="button"
                aria-label="Una figura menos"
                onClick={() => setFigures((n) => Math.max(1, n - 1))}
              >
                −
              </button>
              <output key={figures} className="bump" aria-live="polite">{figures}</output>
              <button
                type="button"
                aria-label="Una figura más"
                onClick={() => setFigures((n) => Math.min(50, n + 1))}
              >
                +
              </button>
            </div>
          </div>

          {typeId === "mascota" && (
            <label className="block">
              <span className="field-label">Tu mascota</span>
              <input
                className="input"
                type="text"
                value={pet}
                onChange={(e) => setPet(e.target.value)}
                placeholder="Especie, raza y nombre. Ej.: perro, bodeguero, se llama Rocky"
              />
            </label>
          )}

          {typeId === "funko-semanasanta" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Figura</span>
                <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                  {["Nazareno", "Costalero", "Capataz", "Monaguillo / acólito", "Mantilla", "Músico de banda", "Otra"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="field-label">Hermandad / cofradía</span>
                <input
                  className="input"
                  type="text"
                  value={brotherhood}
                  onChange={(e) => setBrotherhood(e.target.value)}
                  placeholder="Nombre y localidad"
                />
              </label>
            </div>
          )}

          {typeId === "funko-seleccion" && (
            <label className="block">
              <span className="field-label">Jugador(es)</span>
              <input
                className="input"
                type="text"
                value={player}
                onChange={(e) => setPlayer(e.target.value)}
                placeholder="Nombre y dorsal, o tu nombre con la camiseta de la Selección"
              />
            </label>
          )}

          <label className="block">
            <span className="field-label">
              {typeId === "mascota" ? "Cómo es" : "Cómo es y qué lleva puesto"}
            </span>
            <textarea
              className="input min-h-24 resize-y"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              placeholder={
                typeId === "mascota"
                  ? "Color del pelo, manchas, collar, si lleva pañuelo o algo que le identifique…"
                  : "Pelo, barba, gafas, tatuajes, ropa (uniforme de trabajo, camiseta de su equipo, disfraz…) y lo que lleve en las manos"
              }
            />
          </label>
        </fieldset>
      ) : (
        <fieldset key={typeId} className="swap-in grid gap-5">
          <legend className="form-step">
            <span>2</span> Tu idea
          </legend>
          <label className="block">
            <span className="field-label">Cuéntanos qué necesitas</span>
            <textarea
              className="input min-h-32 resize-y"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={
                typeId === "otro"
                  ? "Cuéntanos tu idea aunque no la veas en el catálogo: qué es, para qué, medidas, colores…"
                  : "Qué es, medidas aproximadas, colores, cuántas unidades, texto o logo que deba llevar…"
              }
            />
          </label>
        </fieldset>
      )}

      {/* 3 · Tus datos */}
      <fieldset className="grid gap-5">
        <legend className="form-step">
          <span>3</span> Tus datos
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
        <button type="submit" className="btn btn-green send-btn text-lg">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.5-.6c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.5 3.9.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.4-.6Z" />
          </svg>
          Enviar por WhatsApp
        </button>
        <p className="text-sm font-semibold leading-5 text-toy-ink/60">
          Sin compromiso
          <br className="hidden sm:block" /> Respuesta en 24–48 h
        </p>
      </div>
    </form>
  );
}

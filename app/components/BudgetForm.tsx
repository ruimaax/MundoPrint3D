"use client";

import { useState } from "react";
import { categories } from "../data/products";
import { waLink } from "../data/contact";

// Formulario de pedido: compone el mensaje y lo abre en WhatsApp, donde se
// cierra el trato. Sin backend.
export default function BudgetForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState(categories[0].orderTitle);
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "¡Hola! Quiero pedir presupuesto desde la web.",
      name ? `Soy ${name.trim()}.` : null,
      `Quiero: ${type}.`,
      details.trim() ? `Mi idea: ${details.trim()}` : null,
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Tu nombre</span>
          <input
            className="input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="¿Cómo te llamas?"
            autoComplete="name"
          />
        </label>

        <label className="block">
          <span className="field-label">¿Qué quieres?</span>
          <select
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.orderTitle}>
                {cat.orderTitle}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="field-label">Cuéntanos tu idea</span>
        <textarea
          className="input min-h-32 resize-y"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Para quién es, qué quieres que lleve, colores, fecha límite si la hay…"
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-green text-lg">
          Enviar por WhatsApp
        </button>
        <p className="text-sm font-semibold text-toy-ink/60">
          Sin compromiso · Respuesta en 24–48 h
        </p>
      </div>
    </form>
  );
}

"use client";

import { ChangeEvent, DragEvent, FormEvent, useEffect, useRef, useState } from "react";
import MiniFunko, { FunkoGuide } from "./MiniFunko";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const PROJECT_TYPES = [
  "Funko personalizado",
  "Funkos de la Selección",
  "Funkos de Semana Santa",
  "Funko de tu mascota",
  "Rótulos y nombres",
  "Llaveros",
  "Detalles para eventos",
  "Decoración y figuras",
  "Piezas a medida",
  "Otra idea",
];

export default function QuoteForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [projectType, setProjectType] = useState("");
  const [details, setDetails] = useState("");

  // Si llegas desde una tarjeta del catálogo (?idea=...) o desde el
  // Fúnko-Lab (?detalle=...), el pedido viene ya medio relleno.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idea = params.get("idea");
    const detalle = params.get("detalle");
    if (idea && PROJECT_TYPES.includes(idea)) setProjectType(idea);
    if (detalle) setDetails(detalle);
  }, []);

  const selectFile = (nextFile?: File) => {
    if (!nextFile) return;
    if (nextFile.size > MAX_FILE_SIZE) {
      setError("El archivo supera los 10 MB. Puedes compartirlo mediante un enlace.");
      return;
    }

    setFile(nextFile);
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(nextFile.type.startsWith("image/") ? URL.createObjectURL(nextFile) : null);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => selectFile(event.target.files?.[0]);

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    selectFile(event.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("sending");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo enviar el formulario.");
      setStatus("sent");
    } catch (submitError) {
      setStatus("idle");
      setError(submitError instanceof Error ? submitError.message : "No se pudo enviar. Inténtalo de nuevo.");
    }
  };

  if (status === "sent") {
    return (
      <section id="encargo" className="bg-[#6c4cff] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl rounded-[6px] border-2 border-[#191430] bg-white p-8 text-center shadow-[0_5px_0_#191430] sm:p-14">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-[6px] border-2 border-[#191430] bg-[#ffb97a] text-2xl shadow-[0_3px_0_#191430]">✓</span>
          <h2 className="font-display mt-6 text-3xl font-bold sm:text-5xl">Pedido recibido</h2>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-[#191430]/70">Revisaré toda la información y te responderé con precio y siguientes pasos en 24–48 horas.</p>
          <button type="button" className="btn-pop btn-grape mt-8" onClick={() => setStatus("idle")}>Pedir otra cosa</button>
        </div>
      </section>
    );
  }

  return (
    <section id="encargo" className="relative overflow-hidden bg-[#6c4cff] px-5 py-20 text-white sm:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-[6px] bg-fuchsia-400/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-[6px] bg-amber-300/30 blur-3xl" />
        <div className="balloon-float hidden lg:block">
          <MiniFunko variant="globo" className="w-16" />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <span className="tag -rotate-1">Sin compromiso</span>
          <h2 className="font-display mt-5 max-w-xl text-balance text-4xl font-bold sm:text-6xl">Pide el tuyo en un minuto</h2>
          <p className="mt-6 max-w-md text-base leading-7 text-white/85">Elige qué quieres, mándame una foto o un enlace si lo tienes, y te respondo con precio cerrado. Así de fácil.</p>

          <div className="mt-10 space-y-4 text-sm text-white/90">
            {["Presupuesto gratis y sin compromiso", "Respuesta en 24–48 horas", "Tus fotos solo se usan para tu pedido"].map((benefit) => (
              <p key={benefit} className="flex items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] border-2 border-white/40 bg-white/15 text-xs">✓</span>{benefit}</p>
            ))}
          </div>

          <FunkoGuide variant="repartidor" className="mt-12">
            En cuanto tu pieza salga de la impresora, la reviso y va para tu casa.
          </FunkoGuide>
        </div>

        <form onSubmit={onSubmit} className="relative rounded-[6px] border-2 border-[#191430] bg-white p-6 text-[#191430] shadow-[0_5px_0_#191430] sm:p-9">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="form-field">
              <span>Nombre *</span>
              <input name="name" required autoComplete="name" placeholder="¿Cómo te llamas?" />
            </label>
            <label className="form-field">
              <span>Email *</span>
              <input name="email" required type="email" autoComplete="email" placeholder="tu@email.com" />
            </label>
            <label className="form-field">
              <span>¿Qué quieres? *</span>
              <select
                name="projectType"
                required
                value={projectType}
                onChange={(event) => setProjectType(event.target.value)}
              >
                <option value="" disabled>Elige una opción</option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Cantidad aproximada</span>
              <input name="quantity" type="number" min="1" placeholder="Ej. 1, 10, 50…" />
            </label>
          </div>

          <label className="form-field mt-5">
            <span>Enlace de referencia</span>
            <input name="referenceLink" type="url" placeholder="Instagram, Pinterest, Drive, modelo 3D…" />
          </label>

          <div className="mt-5">
            <span className="mb-2 block text-sm font-bold">Foto o archivo</span>
            <input ref={inputRef} className="sr-only" name="file" type="file" accept="image/*,.pdf,.stl,.3mf,.obj" onChange={onInputChange} />
            {file ? (
              <div className="flex items-center gap-4 rounded-[6px] border-2 border-violet-200 bg-violet-50 p-3">
                {preview ? <img src={preview} alt="Vista previa del archivo" className="h-16 w-16 rounded-[4px] object-cover" /> : <span className="grid h-16 w-16 place-items-center rounded-[4px] bg-violet-100 text-xs font-bold text-violet-700">ARCHIVO</span>}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{file.name}</p>
                  <p className="mt-1 text-xs text-[#191430]/50">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button type="button" onClick={removeFile} className="rounded-[6px] px-3 py-2 text-sm text-[#191430]/50 hover:bg-black/5 hover:text-[#191430]">Quitar</button>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onDragOver={(event) => event.preventDefault()}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }}
                className="group cursor-pointer rounded-[6px] border-2 border-dashed border-violet-300 bg-violet-50/60 px-5 py-8 text-center transition hover:border-violet-500 hover:bg-violet-50"
              >
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-[6px] bg-white text-xl text-violet-700 shadow-sm transition group-hover:scale-110">↑</span>
                <p className="mt-3 text-sm font-bold">Arrastra aquí o elige un archivo</p>
                <p className="mt-1 text-xs text-[#191430]/40">JPG, PNG, PDF, STL, 3MF u OBJ · máximo 10 MB</p>
              </div>
            )}
          </div>

          <label className="form-field mt-5">
            <span>Cuéntame los detalles *</span>
            <textarea
              name="details"
              required
              rows={5}
              placeholder="Para quién es, tamaño aproximado, colores, fecha ideal…"
              value={details}
              onChange={(event) => setDetails(event.target.value)}
            />
          </label>

          <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-[#191430]/60">
            <input required name="privacy" type="checkbox" className="mt-0.5 h-4 w-4 accent-violet-700" />
            <span>Acepto que se usen estos datos únicamente para responder a mi solicitud de presupuesto.</span>
          </label>

          {error ? <p role="alert" className="mt-5 rounded-[4px] bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={status === "sending"}
            className={`btn-pop btn-grape mt-6 w-full disabled:cursor-wait ${status === "sending" ? "btn-printing" : ""}`}
          >
            {status === "sending" ? "Imprimiendo tu pedido…" : "Enviar mi pedido"}
          </button>
          <p className="mt-3 text-center text-xs text-[#191430]/40">Sin compromiso. Tus archivos no se comparten con terceros.</p>
        </form>
      </div>
    </section>
  );
}

"use client";

import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function QuoteForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

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
      <section id="encargo" className="quote-lab px-5 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 text-center text-violet-950 sm:p-14">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-violet-100 text-2xl">✓</span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">¡Idea recibida!</h2>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-black/55">Revisaré toda la información y te responderé con los siguientes pasos en 24–48 horas.</p>
          <button type="button" className="mt-8 rounded-full bg-violet-950 px-6 py-3 text-sm font-semibold text-white" onClick={() => setStatus("idle")}>Enviar otra idea</button>
        </div>
      </section>
    );
  }

  return (
    <section id="encargo" className="quote-lab relative overflow-hidden px-5 py-24 text-white sm:px-10 lg:px-16 lg:py-36">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-fuchsia-400/25 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="section-label !text-orange-200">Tu idea empieza aquí</p>
          <h2 className="headline-display max-w-xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">Manda una foto, un enlace o cuéntamelo.</h2>
          <p className="mt-6 max-w-md text-base leading-7 text-white/70">Con lo que tengas es suficiente. Recibirás una respuesta personal y sin compromiso.</p>

          <div className="mt-10 space-y-4 text-sm text-white/70">
            {["Presupuesto sin compromiso", "Tus archivos se usan solo para valorar el proyecto", "Respuesta habitual en 24–48 horas"].map((benefit) => (
              <p key={benefit} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs">✓</span>{benefit}</p>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="quote-form-shell relative rounded-[2rem] bg-white p-6 text-[#17111f] shadow-2xl shadow-violet-950/20 sm:p-9">
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
              <span>¿Qué quieres hacer? *</span>
              <select name="projectType" required defaultValue="">
                <option value="" disabled>Elige una opción</option>
                <option>Regalo personalizado</option>
                <option>Decoración o rótulo</option>
                <option>Pieza funcional o recambio</option>
                <option>Prototipo</option>
                <option>Serie de varias piezas</option>
                <option>Otra idea</option>
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
            <span className="mb-2 block text-sm font-medium">Foto o archivo</span>
            <input ref={inputRef} className="sr-only" name="file" type="file" accept="image/*,.pdf,.stl,.3mf,.obj" onChange={onInputChange} />
            {file ? (
              <div className="flex items-center gap-4 rounded-2xl border border-violet-200 bg-violet-50 p-3">
                {preview ? <img src={preview} alt="Vista previa del archivo" className="h-16 w-16 rounded-xl object-cover" /> : <span className="grid h-16 w-16 place-items-center rounded-xl bg-violet-100 text-xs font-bold text-violet-700">ARCHIVO</span>}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{file.name}</p>
                  <p className="mt-1 text-xs text-black/45">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button type="button" onClick={removeFile} className="rounded-full px-3 py-2 text-sm text-black/45 hover:bg-black/5 hover:text-black">Quitar</button>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onDragOver={(event) => event.preventDefault()}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }}
                className="group cursor-pointer rounded-2xl border border-dashed border-violet-300 bg-violet-50/60 px-5 py-8 text-center transition hover:border-violet-500 hover:bg-violet-50"
              >
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white text-xl text-violet-700 shadow-sm transition group-hover:scale-110">↑</span>
                <p className="mt-3 text-sm font-semibold">Arrastra aquí o elige un archivo</p>
                <p className="mt-1 text-xs text-black/40">JPG, PNG, PDF, STL, 3MF u OBJ · máximo 10 MB</p>
              </div>
            )}
          </div>

          <label className="form-field mt-5">
            <span>Cuéntame los detalles *</span>
            <textarea name="details" required rows={5} placeholder="Para qué sirve, tamaño aproximado, color, fecha ideal…" />
          </label>

          <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-black/50">
            <input required name="privacy" type="checkbox" className="mt-0.5 h-4 w-4 accent-violet-700" />
            <span>Acepto que se usen estos datos únicamente para responder a mi solicitud de presupuesto.</span>
          </label>

          {error ? <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button type="submit" disabled={status === "sending"} className="mt-6 flex w-full items-center justify-center rounded-full bg-[#17111f] px-6 py-4 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60">
            {status === "sending" ? "Enviando…" : "Enviar mi idea"}
          </button>
          <p className="mt-3 text-center text-xs text-black/35">Sin compromiso. Tus archivos no se comparten con terceros.</p>
        </form>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { SECTION_COLORS, coverOf, type Catalog, type Photo, type Section } from "../data/catalog";

// Panel sencillo: crear y borrar secciones, ordenarlas, y subir o quitar
// fotos de cada una. Cada cambio se guarda al momento en Cloudflare.

type Status = { kind: "idle" | "saving" | "saved" | "error"; text?: string };

const ADMIN_HEADERS = { "x-admin": "1" };

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "seccion"
  );
}

// Reduce la foto antes de subirla (máx. 1600 px, WebP o JPG) para que la web
// cargue rápido aunque el cliente suba fotos del móvil a tamaño completo.
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  const webp = await toBlob("image/webp");
  if (webp && webp.type === "image/webp") return webp;
  const jpg = await toBlob("image/jpeg");
  if (!jpg) throw new Error("No se pudo procesar la imagen");
  return jpg;
}

async function uploadImage(file: File): Promise<string> {
  const blob = await shrink(file);
  const res = await fetch("/admin/api/images", {
    method: "POST",
    headers: { ...ADMIN_HEADERS, "content-type": blob.type },
    body: blob,
  });
  const data = (await res.json().catch(() => ({}))) as { src?: string; error?: string };
  if (!res.ok || !data.src) throw new Error(data.error ?? "No se pudo subir la imagen");
  return data.src;
}

// Borra del almacén una imagen subida desde el panel (las de la web original
// viven en /public y no se tocan).
function deleteImage(src?: string) {
  if (!src?.startsWith("/img/")) return;
  fetch(`/admin/api/images/${src.slice(5)}`, { method: "DELETE", headers: ADMIN_HEADERS }).catch(() => {});
}

export default function AdminPanel() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [locked, setLocked] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [busy, setBusy] = useState<string | null>(null);
  const saving = useRef<Promise<void>>(Promise.resolve());
  // Última versión del catálogo, para los cambios que llegan tras una subida.
  const latest = useRef<Catalog | null>(null);

  useEffect(() => {
    fetch("/api/catalog", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(async (c: Catalog) => {
        latest.current = c;
        setCatalog(c);
        // ¿Hace falta entrar con la contraseña?
        const check = await fetch("/admin/api/session", { cache: "no-store" });
        if (check.status === 401) setLocked(true);
        else if (!check.ok) {
          const data = (await check.json().catch(() => ({}))) as { error?: string };
          setStatus({ kind: "error", text: data.error ?? "El panel no está disponible" });
        }
      })
      .catch(() =>
        setLoadError(
          "No se pudo cargar el catálogo. El panel solo funciona en la web publicada (o con `npm run cf:dev`).",
        ),
      );
  }, []);

  // Aplica un cambio y lo guarda. Los guardados van en fila para que nunca
  // se pisen dos cambios seguidos.
  const commit = (next: Catalog) => {
    latest.current = next;
    setCatalog(next);
    setStatus({ kind: "saving" });
    saving.current = saving.current.then(async () => {
      try {
        const res = await fetch("/admin/api/catalog", {
          method: "PUT",
          headers: { ...ADMIN_HEADERS, "content-type": "application/json" },
          body: JSON.stringify(next),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (res.status === 401) setLocked(true);
        if (!res.ok) throw new Error(data.error ?? "No se pudo guardar");
        setStatus({ kind: "saved" });
      } catch (err) {
        setStatus({ kind: "error", text: (err as Error).message });
      }
    });
  };

  const update = (id: string, change: (s: Section) => Section) => {
    const current = latest.current;
    if (!current) return;
    commit({ sections: current.sections.map((s) => (s.id === id ? change(s) : s)) });
  };

  if (locked) {
    return (
      <Shell status={{ kind: "idle" }}>
        <Login onDone={() => setLocked(false)} />
      </Shell>
    );
  }
  if (loadError) {
    return (
      <Shell status={status}>
        <p className="rounded-2xl bg-white p-6 font-semibold text-toy-red shadow-[var(--shadow-soft)]">{loadError}</p>
      </Shell>
    );
  }
  if (!catalog) {
    return (
      <Shell status={status}>
        <p className="font-semibold text-toy-ink/60">Cargando…</p>
      </Shell>
    );
  }

  const addSection = (title: string, color: string) => {
    let id = slugify(title);
    const sections = latest.current?.sections ?? [];
    const taken = new Set(sections.map((s) => s.id));
    for (let n = 2; taken.has(id); n++) id = `${slugify(title)}-${n}`;
    commit({ sections: [{ id, title, color, photos: [] }, ...sections] });
  };

  const removeSection = (section: Section) => {
    if (!confirm(`¿Borrar la sección «${section.title}» y todas sus fotos?`)) return;
    deleteImage(section.cover);
    section.photos.forEach((p) => deleteImage(p.src));
    commit({ sections: (latest.current?.sections ?? []).filter((s) => s.id !== section.id) });
  };

  const move = (index: number, delta: number) => {
    const sections = [...(latest.current?.sections ?? [])];
    const to = index + delta;
    if (to < 0 || to >= sections.length) return;
    [sections[index], sections[to]] = [sections[to], sections[index]];
    commit({ sections });
  };

  const run = async (key: string, task: () => Promise<void>) => {
    setBusy(key);
    try {
      await task();
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
    } finally {
      setBusy(null);
    }
  };

  const changeCover = (section: Section, file: File) =>
    run(`cover-${section.id}`, async () => {
      const src = await uploadImage(file);
      deleteImage(section.cover);
      update(section.id, (s) => ({ ...s, cover: src }));
    });

  const addPhotos = (section: Section, files: FileList) =>
    run(`photos-${section.id}`, async () => {
      const added: Photo[] = [];
      for (const file of Array.from(files)) {
        const src = await uploadImage(file);
        added.push({ id: crypto.randomUUID(), src });
      }
      // Las nuevas van primero: así salen antes en la vitrina.
      update(section.id, (s) => ({ ...s, photos: [...added, ...s.photos] }));
    });

  const removePhoto = (section: Section, photoId: string) => {
    const photo = section.photos.find((p) => p.id === photoId);
    if (!photo || !confirm("¿Quitar esta foto?")) return;
    deleteImage(photo.src);
    update(section.id, (s) => ({ ...s, photos: s.photos.filter((p) => p.id !== photoId) }));
  };

  return (
    <Shell status={status}>
      <NewSection onCreate={addSection} />

      <div className="mt-10 grid gap-6">
        {catalog.sections.map((section, i) => (
          <article key={section.id} className="rounded-[22px] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-7">
            <header className="flex flex-wrap items-center gap-3">
              <span className="h-5 w-5 shrink-0 rounded-full" style={{ background: section.color }} />
              <input
                className="input !mt-0 max-w-sm flex-1 !py-2 text-lg !font-extrabold"
                defaultValue={section.title}
                aria-label="Nombre de la sección"
                maxLength={60}
                onBlur={(e) => {
                  const title = e.target.value.trim();
                  if (title && title !== section.title) update(section.id, (s) => ({ ...s, title }));
                  else e.target.value = section.title;
                }}
              />
              <div className="ml-auto flex gap-2">
                <button type="button" className="chip" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir">
                  ↑
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() => move(i, 1)}
                  disabled={i === catalog.sections.length - 1}
                  aria-label="Bajar"
                >
                  ↓
                </button>
                <button type="button" className="chip !text-toy-red" onClick={() => removeSection(section)}>
                  Borrar sección
                </button>
              </div>
            </header>

            <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr]">
              <div>
                <p className="field-label">Portada del catálogo</p>
                <div
                  className="mt-2 aspect-square overflow-hidden rounded-2xl"
                  style={{ background: section.color }}
                >
                  {coverOf(section) && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={coverOf(section)} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <FileButton
                  label={busy === `cover-${section.id}` ? "Subiendo…" : "Cambiar portada"}
                  disabled={busy !== null}
                  onFiles={(files) => changeCover(section, files[0])}
                />
              </div>

              <div>
                <p className="field-label">Fotos de la vitrina · {section.photos.length}</p>
                <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {section.photos.map((photo) => (
                    <div key={photo.id} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-toy-paper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.src} alt={photo.title ?? ""} className="h-full w-full object-cover" loading="lazy" />
                      <button
                        type="button"
                        onClick={() => removePhoto(section, photo.id)}
                        aria-label="Quitar foto"
                        className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-toy-ink/85 text-lg font-bold text-white hover:bg-toy-red"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <FileButton
                    tile
                    multiple
                    label={busy === `photos-${section.id}` ? "Subiendo…" : "+ Añadir fotos"}
                    disabled={busy !== null}
                    onFiles={(files) => addPhotos(section, files)}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Shell>
  );
}

function Shell({ status, children }: { status: Status; children: React.ReactNode }) {
  const label =
    status.kind === "saving"
      ? "Guardando…"
      : status.kind === "saved"
        ? "Guardado ✓"
        : status.kind === "error"
          ? status.text ?? "Error"
          : "";
  return (
    <main className="min-h-screen bg-toy-paper px-5 py-10 text-toy-ink sm:px-8">
      <div className="mx-auto max-w-shell">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mundo-print-3d-logo.png" alt="" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="display text-3xl">Panel de la web</h1>
              <p className="text-sm font-semibold text-toy-ink/60">Secciones del catálogo y fotos de la vitrina</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {label && (
              <span
                className={`text-sm font-bold ${status.kind === "error" ? "text-toy-red" : "text-toy-ink/60"}`}
                role="status"
              >
                {label}
              </span>
            )}
            <a href="/" target="_blank" rel="noopener" className="btn btn-ink !py-2.5 text-sm">
              Ver la web ↗
            </a>
            <button
              type="button"
              className="chip"
              onClick={async () => {
                await fetch("/admin/api/logout", { method: "POST", headers: ADMIN_HEADERS });
                location.reload();
              }}
            >
              Salir
            </button>
          </div>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

// Pantalla de entrada: una contraseña, la que le des al cliente.
function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  return (
    <form
      className="mx-auto max-w-md rounded-[22px] bg-white p-7 shadow-[var(--shadow-soft)]"
      onSubmit={async (e) => {
        e.preventDefault();
        setSending(true);
        setError(null);
        try {
          const res = await fetch("/admin/api/login", {
            method: "POST",
            headers: { ...ADMIN_HEADERS, "content-type": "application/json" },
            body: JSON.stringify({ password }),
          });
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          if (!res.ok) throw new Error(data.error ?? "No se pudo entrar");
          onDone();
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setSending(false);
        }
      }}
    >
      <h2 className="display text-2xl">Entrar al panel</h2>
      <p className="mt-2 text-sm font-medium text-toy-ink/60">
        Escribe la contraseña del panel. Se queda guardada 30 días en este dispositivo.
      </p>
      <label className="mt-5 block">
        <span className="field-label">Contraseña</span>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          autoFocus
        />
      </label>
      {error && <p className="mt-3 text-sm font-bold text-toy-red">{error}</p>}
      <button type="submit" className="btn btn-red mt-5 w-full" disabled={sending || !password}>
        {sending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

function NewSection({ onCreate }: { onCreate: (title: string, color: string) => void }) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(SECTION_COLORS[0]);
  return (
    <form
      className="flex flex-wrap items-end gap-4 rounded-[22px] bg-toy-ink p-5 text-white sm:p-7"
      onSubmit={(e) => {
        e.preventDefault();
        const t = title.trim();
        if (!t) return;
        onCreate(t, color);
        setTitle("");
      }}
    >
      <label className="block min-w-[220px] flex-1">
        <span className="field-label text-toy-yellow">Nueva sección</span>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej.: Funkos de Navidad"
          maxLength={60}
        />
      </label>
      <div>
        <span className="field-label text-toy-yellow">Color</span>
        <div className="mt-[0.45rem] flex gap-2">
          {SECTION_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              onClick={() => setColor(c)}
              className="h-10 w-10 rounded-full"
              style={{
                background: c,
                boxShadow: c === color ? "0 0 0 3px #201436, 0 0 0 5px #ffc400" : "inset 0 0 0 2px rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
      <button type="submit" className="btn btn-yellow" disabled={!title.trim()}>
        Crear sección
      </button>
    </form>
  );
}

function FileButton({
  label,
  onFiles,
  disabled,
  multiple,
  tile,
}: {
  label: string;
  onFiles: (files: FileList) => void;
  disabled?: boolean;
  multiple?: boolean;
  tile?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => ref.current?.click()}
        className={
          tile
            ? "grid aspect-[4/5] place-items-center rounded-xl border-2 border-dashed border-toy-ink/25 p-2 text-center text-sm font-extrabold text-toy-ink/70 hover:border-toy-ink hover:text-toy-ink disabled:opacity-50"
            : "chip mt-3 w-full disabled:opacity-50"
        }
      >
        {label}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={(e) => {
          if (e.target.files?.length) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}

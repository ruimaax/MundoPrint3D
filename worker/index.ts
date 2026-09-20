// Worker de Cloudflare: sirve la web estática (carpeta /out) y la API del
// panel de administración.
//
//   GET    /api/catalog               catálogo público (JSON)
//   GET    /img/<nombre>              imágenes subidas desde el panel (R2)
//   GET    /admin/api/session         ¿hay sesión abierta?
//   POST   /admin/api/login           entrar con la contraseña del panel
//   POST   /admin/api/logout          salir
//   PUT    /admin/api/catalog         guarda el catálogo            ┐ requieren
//   POST   /admin/api/images          sube una imagen, devuelve src  │ haber
//   DELETE /admin/api/images/<nombre> borra una imagen              ┘ entrado
//
// El catálogo y las imágenes se guardan en Workers KV (plan gratuito, sin
// tarjeta). Si el catálogo aún no existe se usa la semilla de
// app/data/catalog.ts.

import { SEED_CATALOG, type Catalog, type Photo, type Section } from "../app/data/catalog";

// --- tipos mínimos de Cloudflare (sin dependencias extra) ---
interface KVNamespace {
  get(key: string, type: "json"): Promise<unknown>;
  getWithMetadata(
    key: string,
    type: "arrayBuffer",
  ): Promise<{ value: ArrayBuffer | null; metadata: { contentType?: string } | null }>;
  put(
    key: string,
    value: ArrayBuffer | string,
    options?: { metadata?: { contentType: string }; expirationTtl?: number },
  ): Promise<void>;
  delete(key: string): Promise<void>;
}
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  STORE: KVNamespace;
  /** Contraseña del panel. Se pone con: npx wrangler secret put ADMIN_PASSWORD */
  ADMIN_PASSWORD?: string;
  /** Solo en local (.dev.vars): "1" entra al panel sin contraseña. */
  DEV_ADMIN?: string;
}

const CATALOG_KEY = "catalog.json";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (pathname === "/api/catalog" && method === "GET") {
      return json(await readCatalog(env));
    }

    if (pathname.startsWith("/img/") && method === "GET") {
      const name = pathname.slice(5);
      if (!/^[a-z0-9-]+\.(webp|jpg|png)$/.test(name)) return new Response("No encontrado", { status: 404 });
      const obj = await env.STORE.getWithMetadata(`img/${name}`, "arrayBuffer");
      if (!obj.value) return new Response("No encontrado", { status: 404 });
      return new Response(obj.value, {
        headers: {
          "content-type": obj.metadata?.contentType ?? "application/octet-stream",
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    }

    if (pathname === "/admin/api/login" && method === "POST") {
      return login(request, env);
    }

    if (pathname === "/admin/api/logout" && method === "POST") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json", "set-cookie": clearCookie() },
      });
    }

    if (pathname.startsWith("/admin/api/")) {
      const denied = await checkAdmin(request, env);
      if (denied) return denied;

      // ¿Hay sesión? El panel lo consulta al abrirse.
      if (pathname === "/admin/api/session" && method === "GET") {
        return json({ ok: true });
      }

      if (pathname === "/admin/api/catalog" && method === "PUT") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "JSON no válido" }, 400);
        }
        const catalog = validateCatalog(body);
        if (!catalog) return json({ error: "Catálogo no válido" }, 400);
        await env.STORE.put(CATALOG_KEY, JSON.stringify(catalog));
        return json(catalog);
      }

      if (pathname === "/admin/api/images" && method === "POST") {
        const type = (request.headers.get("content-type") ?? "").split(";")[0].trim();
        const ext = IMAGE_TYPES[type];
        if (!ext) return json({ error: "Formato no admitido (usa JPG, PNG o WebP)" }, 415);
        const data = await request.arrayBuffer();
        if (data.byteLength === 0 || data.byteLength > MAX_IMAGE_BYTES) {
          return json({ error: "La imagen es demasiado grande" }, 413);
        }
        const name = `${crypto.randomUUID()}.${ext}`;
        await env.STORE.put(`img/${name}`, data, { metadata: { contentType: type } });
        return json({ src: `/img/${name}` }, 201);
      }

      if (pathname.startsWith("/admin/api/images/") && method === "DELETE") {
        const name = pathname.slice("/admin/api/images/".length);
        if (!/^[a-z0-9-]+\.(webp|jpg|png)$/.test(name)) return json({ error: "Nombre no válido" }, 400);
        await env.STORE.delete(`img/${name}`);
        return json({ ok: true });
      }

      return json({ error: "No encontrado" }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};

async function readCatalog(env: Env): Promise<Catalog> {
  try {
    const stored = (await env.STORE.get(CATALOG_KEY, "json")) as Catalog | null;
    return stored?.sections ? stored : SEED_CATALOG;
  } catch {
    return SEED_CATALOG;
  }
}

// --- validación del catálogo que manda el panel ---

const SRC_RE = /^\/(img|products|gallery)\/[A-Za-z0-9._-]+$/;
const ID_RE = /^[a-z0-9-]{1,60}$/;
const COLOR_RE = /^#[0-9a-fA-F]{6}$/;

function str(v: unknown, max: number, required = false): string | undefined | null {
  if (v === undefined || v === null || v === "") return required ? null : undefined;
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return required ? null : undefined;
  return t.length > max ? null : t;
}

function validateCatalog(input: unknown): Catalog | null {
  if (!input || typeof input !== "object") return null;
  const raw = (input as { sections?: unknown }).sections;
  if (!Array.isArray(raw) || raw.length > 60) return null;
  const ids = new Set<string>();
  const sections: Section[] = [];

  for (const s of raw) {
    if (!s || typeof s !== "object") return null;
    const o = s as Record<string, unknown>;
    const id = typeof o.id === "string" && ID_RE.test(o.id) ? o.id : null;
    const title = str(o.title, 60, true);
    const color = typeof o.color === "string" && COLOR_RE.test(o.color) ? o.color : null;
    const description = str(o.description, 300);
    const tagline = str(o.tagline, 40);
    const cover = o.cover === undefined || o.cover === null || o.cover === "" ? undefined : o.cover;
    if (!id || ids.has(id) || !title || !color || description === null || tagline === null) return null;
    if (cover !== undefined && (typeof cover !== "string" || !SRC_RE.test(cover))) return null;
    if (!Array.isArray(o.photos) || o.photos.length > 300) return null;
    ids.add(id);

    const photos: Photo[] = [];
    const photoIds = new Set<string>();
    for (const p of o.photos) {
      if (!p || typeof p !== "object") return null;
      const po = p as Record<string, unknown>;
      const pid = typeof po.id === "string" && po.id.length <= 80 ? po.id : null;
      const src = typeof po.src === "string" && SRC_RE.test(po.src) ? po.src : null;
      const ptitle = str(po.title, 80);
      if (!pid || photoIds.has(pid) || !src || ptitle === null) return null;
      photoIds.add(pid);
      photos.push({ id: pid, src, ...(ptitle ? { title: ptitle } : {}) });
    }

    sections.push({
      id,
      title,
      color,
      ...(cover ? { cover: cover as string } : {}),
      ...(description ? { description } : {}),
      ...(tagline ? { tagline } : {}),
      photos,
    });
  }
  return { sections };
}

// --- acceso al panel: contraseña propia ---
//
// Al entrar se deja una cookie firmada (HMAC con la propia contraseña) que
// vale 30 días. No se guarda ninguna sesión en el servidor.

const COOKIE = "mp3d_admin";
const SESSION_DAYS = 30;

async function checkAdmin(request: Request, env: Env): Promise<Response | null> {
  // Las escrituras llevan esta cabecera: un formulario o una web ajena no
  // pueden ponerla sin permiso CORS, así que no pueden actuar en tu nombre.
  if (request.method !== "GET" && request.headers.get("x-admin") !== "1") {
    return json({ error: "Petición no permitida" }, 403);
  }
  if (env.DEV_ADMIN === "1") return null;
  if (!env.ADMIN_PASSWORD) {
    return json({ error: "El panel aún no tiene contraseña (ADMIN_PASSWORD)" }, 503);
  }
  const cookie = readCookie(request, COOKIE);
  if (!cookie || !(await validSession(cookie, env.ADMIN_PASSWORD))) {
    return json({ error: "Sesión caducada: vuelve a entrar" }, 401);
  }
  return null;
}

async function login(request: Request, env: Env): Promise<Response> {
  if (request.headers.get("x-admin") !== "1") return json({ error: "Petición no permitida" }, 403);
  if (!env.ADMIN_PASSWORD) return json({ error: "El panel aún no tiene contraseña (ADMIN_PASSWORD)" }, 503);

  // Freno a los intentos a lo bruto: 10 fallos por IP cada 10 minutos.
  const ip = request.headers.get("cf-connecting-ip") ?? "local";
  const failKey = `login-fails/${ip}`;
  const fails = Number((await env.STORE.get(failKey, "json")) ?? 0);
  if (fails >= 10) return json({ error: "Demasiados intentos. Prueba dentro de un rato." }, 429);

  let password = "";
  try {
    password = String(((await request.json()) as { password?: unknown }).password ?? "");
  } catch {
    return json({ error: "Petición no válida" }, 400);
  }

  if (!timingSafeEqual(password, env.ADMIN_PASSWORD)) {
    await env.STORE.put(failKey, JSON.stringify(fails + 1), { expirationTtl: 600 });
    return json({ error: "Contraseña incorrecta" }, 401);
  }

  await env.STORE.delete(failKey);
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const value = `${exp}.${await sign(String(exp), env.ADMIN_PASSWORD)}`;
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "content-type": "application/json",
      "set-cookie": `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DAYS * 24 * 60 * 60}`,
    },
  });
}

function clearCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

async function validSession(cookie: string, password: string): Promise<boolean> {
  const [exp, sig] = cookie.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return timingSafeEqual(sig, await sign(exp, password));
}

async function sign(data: string, password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Comparación que tarda lo mismo acierte o falle, para no dar pistas.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

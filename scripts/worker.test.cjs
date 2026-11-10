// Pruebas de la API real con un KV aislado, sin correos ni datos de producción.
const fs = require("node:fs");
const ts = require("typescript");
const assert = require("node:assert/strict");
const { test } = require("node:test");
require.extensions[".ts"] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename);
};
const worker = require("../worker/index.ts").default;
const { SEED_CATALOG, sectionSpans } = require("../app/data/catalog.ts");

function environment() {
  const values = new Map();
  return {
    values,
    DEV_ADMIN: "1",
    STORE: {
      get: async (key) => values.has(key) ? JSON.parse(values.get(key)) : null,
      put: async (key, value) => values.set(key, value),
      delete: async (key) => values.delete(key),
      list: async ({ prefix, cursor = "0", limit = 100 }) => {
        const keys = [...values.keys()].filter((key) => key.startsWith(prefix)).sort();
        const end = Number(cursor) + limit;
        return { keys: keys.slice(Number(cursor), end).map((name) => ({ name })), list_complete: end >= keys.length, cursor: String(end) };
      },
    },
    ASSETS: { fetch: async () => new Response("", { status: 404 }) },
  };
}
const payload = { name: "María", phone: "+34 600 123 456", section: "Funko personalizado", color: "#1f45ff", answers: [{ label: "Cómo es", value: "Con gafas y camiseta roja\nBase azul" }], dueDate: "2026-12-15", when: "15 de diciembre de 2026" };
function call(env, path, method = "GET", body, admin = true) {
  return worker.fetch(new Request(`https://example.test${path}`, {
    method, headers: { "content-type": "application/json", ...(admin ? { "x-admin": "1" } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }), env);
}

test("guarda pedidos con fecha y todas las respuestas sin configurar correo", async () => {
  const env = environment();
  const response = await call(env, "/api/pedido", "POST", payload);
  assert.equal(response.status, 201);
  const { id } = await response.json();
  const order = await (await call(env, `/admin/api/orders/${id}`)).json();
  assert.equal(order.dueDate, payload.dueDate);
  assert.equal(order.status, "pending");
  assert.deepEqual(order.answers, payload.answers);
  assert.equal(order.phone, payload.phone);
  assert.ok(order.createdAt);
  assert.equal((await (await call(env, "/admin/api/orders")).json()).orders.length, 1);
});

test("los envíos simultáneos conservan ambos pedidos", async () => {
  const env = environment();
  const responses = await Promise.all([call(env, "/api/pedido", "POST", payload), call(env, "/api/pedido", "POST", { ...payload, name: "Luis" })]);
  assert.ok(responses.every((response) => response.status === 201));
  assert.equal((await (await call(env, "/admin/api/orders")).json()).orders.length, 2);
});

test("un fallo del proveedor de correo conserva el pedido confirmado", async () => {
  const env = environment();
  Object.assign(env, { RESEND_API_KEY: "test-key", QUOTE_EMAIL_TO: "test@example.test", QUOTE_EMAIL_FROM: "test@example.test" });
  const originalFetch = global.fetch;
  const originalError = console.error;
  const background = [];
  let attempts = 0;
  global.fetch = async () => { attempts++; throw new Error("provider unavailable"); };
  console.error = () => {};
  try {
    const response = await worker.fetch(new Request("https://example.test/api/pedido", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
    }), env, { waitUntil: (promise) => background.push(promise) });
    assert.equal(response.status, 201);
    await Promise.all(background);
    assert.equal(attempts, 1);
    const { id } = await response.json();
    assert.equal((await (await call(env, `/admin/api/orders/${id}`)).json()).name, payload.name);
  } finally { global.fetch = originalFetch; console.error = originalError; }
});

test("sin prisa y sin fecha no crean una fecha en el calendario", async () => {
  const env = environment();
  const response = await call(env, "/api/pedido", "POST", { ...payload, dueDate: null, when: "Sin prisa" });
  const { id } = await response.json();
  const order = await (await call(env, `/admin/api/orders/${id}`)).json();
  assert.equal(order.dueDate, undefined);
  assert.equal(order.when, "Sin prisa");
});

test("rechaza fechas imposibles, estados inválidos y pedidos sin datos", async () => {
  const env = environment();
  for (const dueDate of ["2026-02-30", "2026-13-01", "15/12/2026", 123]) {
    assert.equal((await call(env, "/api/pedido", "POST", { ...payload, dueDate })).status, 400);
  }
  assert.equal((await call(env, "/api/pedido", "POST", { ...payload, phone: "123" })).status, 400);
  assert.equal((await call(env, "/api/pedido", "POST", {})).status, 400);
});

test("cambiar el estado persiste y conserva el detalle", async () => {
  const env = environment();
  const { id } = await (await call(env, "/api/pedido", "POST", payload)).json();
  assert.equal((await call(env, `/admin/api/orders/${id}`, "PATCH", { status: "unknown" })).status, 400);
  for (const status of ["in_progress", "completed", "cancelled", "pending"]) {
    const updated = await (await call(env, `/admin/api/orders/${id}`, "PATCH", { status })).json();
    assert.equal(updated.status, status);
    assert.deepEqual(updated.answers, payload.answers);
    assert.equal((await (await call(env, `/admin/api/orders/${id}`)).json()).status, status);
  }
});

test("el historial es privado y las escrituras requieren cabecera de admin", async () => {
  const env = environment();
  const { id } = await (await call(env, "/api/pedido", "POST", payload)).json();
  assert.equal((await call(env, `/admin/api/orders/${id}`, "PATCH", { status: "completed" }, false)).status, 403);
  env.DEV_ADMIN = undefined;
  env.ADMIN_PASSWORD = "test-password";
  assert.equal((await call(env, "/admin/api/orders")).status, 401);
  assert.equal((await call(env, `/admin/api/orders/${id}`)).status, 401);
});

test("paginación del registro no pierde pedidos después de los primeros 100", async () => {
  const env = environment();
  for (let i = 0; i < 105; i++) env.values.set(`orders/${i}`, JSON.stringify({ ...payload, id: `${i}`, status: "pending" }));
  const first = await (await call(env, "/admin/api/orders")).json();
  assert.equal(first.orders.length, 100);
  assert.ok(first.cursor);
  const last = await (await call(env, `/admin/api/orders?cursor=${first.cursor}`)).json();
  assert.equal(last.orders.length, 5);
  assert.equal(last.cursor, null);
});

test("guarda el orden y los tamaños del catálogo y rechaza tamaños inválidos", async () => {
  const env = environment();
  const sections = [...SEED_CATALOG.sections].reverse().map((section, i) => ({ ...section, size: i === 2 ? "big" : "normal" }));
  assert.equal((await call(env, "/admin/api/catalog", "PUT", { sections })).status, 200);
  const saved = await (await call(env, "/api/catalog")).json();
  assert.deepEqual(saved.sections.map((s) => s.id), sections.map((s) => s.id));
  assert.equal(sectionSpans(saved.sections)[2], "big");
  assert.equal(sectionSpans(saved.sections)[0], "");
  assert.equal((await call(env, "/admin/api/catalog", "PUT", { sections: [{ ...sections[0], size: "invalid" }] })).status, 400);
});

test("un fallo de almacenamiento no confirma un pedido inexistente", async () => {
  const env = environment();
  const original = env.STORE.put;
  env.STORE.put = (key, value) => key.startsWith("orders/") ? Promise.reject(new Error("unavailable")) : original(key, value);
  assert.equal((await call(env, "/api/pedido", "POST", payload)).status, 503);
});

test("trampa antispam y límite de envíos no crean pedidos extra", async () => {
  const env = environment();
  await call(env, "/api/pedido", "POST", { ...payload, website: "bot" });
  assert.equal((await (await call(env, "/admin/api/orders")).json()).orders.length, 0);
  for (let i = 0; i < 5; i++) assert.equal((await call(env, "/api/pedido", "POST", payload)).status, 201);
  assert.equal((await call(env, "/api/pedido", "POST", payload)).status, 429);
  assert.equal((await (await call(env, "/admin/api/orders")).json()).orders.length, 5);
});

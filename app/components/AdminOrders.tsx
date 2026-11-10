"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ORDER_STATUSES, dateLabel, isPending, localDate, type OrderStatus, type StoredOrder } from "../data/orders";

type View = "summary" | "orders" | "catalog";
const headers = { "x-admin": "1", "content-type": "application/json" };

export default function AdminOrders({ children, onLocked }: { children: React.ReactNode; onLocked: () => void }) {
  const [view, setView] = useState<View>("summary");
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const all: StoredOrder[] = [];
      let cursor: string | null = null;
      do {
        const response: Response = await fetch(`/admin/api/orders${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`, { cache: "no-store" });
        if (response.status === 401) { onLocked(); return; }
        if (!response.ok) throw new Error("No se pudieron cargar los pedidos");
        const page = await response.json() as { orders: StoredOrder[]; cursor: string | null };
        all.push(...page.orders);
        cursor = page.cursor;
      } while (cursor);
      setOrders(all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally { setLoading(false); }
  }, [onLocked]);

  useEffect(() => { void load(); }, [load]);

  const pending = orders.filter(isPending);
  const selected = orders.find((order) => order.id === selectedId);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("es");
    return orders.filter((order) =>
      (filter === "all" || (filter === "active" ? isPending(order) : order.status === filter)) &&
      (!date || order.dueDate === date) &&
      (!term || [order.name, order.phone, order.section, order.id].some((value) => value?.toLocaleLowerCase("es").includes(term))),
    );
  }, [orders, query, filter, date]);

  const openOrder = (order: StoredOrder) => { setSelectedId(order.id); setUpdateError(null); setView("orders"); };
  const setStatus = async (status: OrderStatus) => {
    if (!selected || updating) return;
    setUpdating(true);
    setUpdateError(null);
    try {
      const response = await fetch(`/admin/api/orders/${selected.id}`, { method: "PATCH", headers, body: JSON.stringify({ status }) });
      if (response.status === 401) { onLocked(); return; }
      if (!response.ok) throw new Error("No se pudo guardar el estado. Vuelve a intentarlo.");
      const updated = await response.json() as StoredOrder;
      setOrders((current) => current.map((order) => order.id === updated.id ? updated : order));
    } catch (err) { setUpdateError((err as Error).message); }
    finally { setUpdating(false); }
  };

  return (
    <>
      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Administración">
        {([["summary", "Resumen y calendario"], ["orders", `Pedidos${orders.length ? ` (${orders.length})` : ""}`], ["catalog", "Catálogo"]] as const).map(([id, label]) => (
          <button key={id} type="button" aria-current={view === id ? "page" : undefined}
            className={`rounded-full px-5 py-3 text-sm font-extrabold ${view === id ? "bg-toy-blue text-white" : "bg-white text-toy-ink"}`}
            onClick={() => { setView(id); setSelectedId(null); }}>{label}</button>
        ))}
      </nav>

      {!loading && !error && <div role="status" className={`mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 p-5 ${pending.length ? "border-toy-yellow bg-toy-yellow/20" : "border-emerald-200 bg-emerald-50"}`}>
        <div><p className="text-lg font-extrabold">{pending.length ? `Tienes ${pending.length} pedido${pending.length === 1 ? "" : "s"} pendiente${pending.length === 1 ? "" : "s"}` : "No tienes pedidos pendientes"}</p>
          <p className="mt-1 text-sm font-medium">{pending.length ? "Revisa los nuevos encargos y los que están en preparación." : "Los nuevos pedidos aparecerán aquí al enviarse desde el formulario."}</p></div>
        {pending.length > 0 && <button type="button" className="btn btn-ink !py-2.5 text-sm" onClick={() => { setView("orders"); setSelectedId(null); setFilter("active"); setDate(""); setQuery(""); }}>Ver pendientes →</button>}
      </div>}

      {view !== "catalog" && <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-toy-ink/60">{loading ? "Cargando pedidos…" : `${orders.length} pedidos registrados`}</p>
        <button type="button" className="chip" onClick={() => { setLoading(true); void load(); }} disabled={loading || updating}>Actualizar pedidos ↻</button>
      </div>}
      {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 font-bold text-toy-red">{error}. Pulsa «Actualizar pedidos» para volver a intentarlo.</p>}

      {view === "summary" && <>
        <OrderCalendar orders={orders} onOpen={openOrder} />
        <p className="mt-4 text-sm text-toy-ink/60">El calendario marca las fechas solicitadas por el cliente. Los pedidos sin fecha siguen en el registro de Pedidos.</p>
      </>}

      {view === "orders" && (selected ? <section className="rounded-[22px] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-7" aria-labelledby="order-detail-title">
        <button type="button" className="chip mb-5" onClick={() => { setSelectedId(null); setUpdateError(null); }}>← Volver a los pedidos</button>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div><p className="kicker text-toy-blue">Detalle del pedido</p><h2 id="order-detail-title" className="display mt-2 text-3xl">{selected.name}</h2><p className="mt-2 font-bold">{selected.section}</p></div>
          <label className="block"><span className="field-label">Estado del pedido</span><select className="input" value={selected.status} disabled={updating} onChange={(event) => void setStatus(event.target.value as OrderStatus)}>
            {Object.entries(ORDER_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select></label>
        </div>
        {updating && <p role="status" className="mt-3 font-semibold">Guardando estado…</p>}
        {updateError && <p role="alert" className="mt-3 font-bold text-toy-red">{updateError}</p>}
        <dl className="mt-6 grid gap-5 border-t border-toy-ink/10 pt-6 sm:grid-cols-2">
          <Detail label="Nombre" value={selected.name} />
          <Detail label="Teléfono" value={selected.phone || "No indicado"} />
          <Detail label="Recibido" value={new Date(selected.createdAt).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })} />
          <Detail label="Fecha solicitada" value={selected.dueDate ? dateLabel(selected.dueDate) : selected.when || "Sin fecha indicada"} />
          <Detail label="Sección" value={selected.section} />
          <Detail label="Referencia" value={selected.id} />
        </dl>
        <h3 className="mt-8 text-lg font-extrabold">Todos los detalles del encargo</h3>
        <dl className="mt-4 grid gap-5">{selected.answers.map((answer, i) => <Detail key={i} label={answer.label} value={answer.value || "Sin respuesta"} />)}</dl>
        {!selected.answers.length && <p className="mt-3 text-toy-ink/60">Sin detalles adicionales.</p>}
      </section> : <section aria-labelledby="orders-title">
        <h2 id="orders-title" className="display text-3xl">Pedidos</h2>
        <p className="mt-2 text-sm text-toy-ink/70">Registro de todos los pedidos enviados desde el formulario de la web.</p>
        <div className="my-5 grid gap-3 rounded-2xl bg-white p-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <label><span className="field-label">Buscar</span><input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, teléfono, sección o referencia" /></label>
          <label><span className="field-label">Estado</span><select className="input" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">Todos los estados</option><option value="active">Todos los pendientes</option>
            {Object.entries(ORDER_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select></label>
          <label><span className="field-label">Fecha solicitada</span><input className="input" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <button type="button" className="chip self-end" onClick={() => { setQuery(""); setFilter("all"); setDate(""); }}>Limpiar</button>
        </div>
        <div className="grid gap-3">{filtered.map((order) => <OrderRow key={order.id} order={order} onOpen={openOrder} />)}</div>
        {!loading && !error && !filtered.length && <p className="rounded-2xl bg-white p-6 font-semibold text-toy-ink/60">{orders.length ? "No hay pedidos con estos filtros." : "Todavía no se ha recibido ningún pedido."}</p>}
      </section>)}
      {view === "catalog" && children}
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="field-label">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words font-semibold">{value}</dd></div>;
}

function OrderRow({ order, onOpen }: { order: StoredOrder; onOpen: (order: StoredOrder) => void }) {
  return <button type="button" className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 text-left shadow-[var(--shadow-soft)] transition hover:ring-2 hover:ring-toy-blue focus-visible:ring-2 focus-visible:ring-toy-blue" onClick={() => onOpen(order)}>
    <span className="min-w-0"><span className="block break-words font-extrabold">{order.name} · {order.section}</span>
      <span className="mt-1 block text-sm font-medium text-toy-ink/60">{order.dueDate ? `Para el ${dateLabel(order.dueDate)}` : order.when || "Sin fecha indicada"}</span></span>
    <span className="flex items-center gap-3 text-sm font-bold"><span className={`rounded-full px-3 py-1 ${isPending(order) ? "bg-toy-yellow/25" : "bg-toy-paper"}`}>{ORDER_STATUSES[order.status]}</span><span aria-hidden>→</span></span>
  </button>;
}

function OrderCalendar({ orders, onOpen }: { orders: StoredOrder[]; onOpen: (order: StoredOrder) => void }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [day, setDay] = useState(() => localDate());
  const today = localDate();
  const offset = (month.getDay() + 6) % 7;
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const byDay = new Map<string, StoredOrder[]>();
  for (const order of orders) {
    if (order.dueDate) byDay.set(order.dueDate, [...(byDay.get(order.dueDate) ?? []), order]);
  }
  const dayOrders = byDay.get(day) ?? [];

  return <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
    <section className="rounded-[22px] bg-white p-4 shadow-[var(--shadow-soft)] sm:p-6" aria-label="Calendario de pedidos">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="display text-2xl capitalize">{month.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</h2>
        <div className="flex gap-2"><button type="button" className="chip" aria-label="Mes anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>←</button>
          <button type="button" className="chip" onClick={() => { const now = new Date(); setMonth(new Date(now.getFullYear(), now.getMonth(), 1)); setDay(localDate(now)); }}>Hoy</button>
          <button type="button" className="chip" aria-label="Mes siguiente" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>→</button></div>
      </header>
      <div className="grid grid-cols-7 gap-1 text-center sm:gap-2">
        {["L", "M", "X", "J", "V", "S", "D"].map((label, i) => <span key={i} className="py-2 text-xs font-extrabold text-toy-ink/50" aria-hidden>{label}</span>)}
        {Array.from({ length: offset }, (_, i) => <span key={`empty-${i}`} />)}
        {Array.from({ length: total }, (_, i) => {
          const value = localDate(new Date(month.getFullYear(), month.getMonth(), i + 1));
          const count = byDay.get(value)?.length ?? 0;
          return <button key={value} type="button" aria-pressed={day === value} aria-current={value === today ? "date" : undefined}
            aria-label={`${dateLabel(value)}, ${count} pedidos`}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border-2 p-1 text-sm font-bold sm:min-h-20 ${day === value ? "border-toy-blue bg-toy-blue text-white" : count ? "border-toy-yellow bg-toy-yellow/20" : "border-transparent bg-toy-paper/50"} ${value === today && day !== value ? "!border-toy-blue" : ""}`}
            onClick={() => setDay(value)}><span>{i + 1}</span>{count > 0 && <span className={`rounded-full px-1.5 text-[10px] ${day === value ? "bg-white/20" : "bg-toy-yellow"}`}>{count}<span className="hidden sm:inline"> ped.</span></span>}</button>;
        })}
      </div>
      <p className="mt-4 text-xs font-semibold text-toy-ink/60">● Amarillo: fecha con pedidos · Azul: día seleccionado</p>
    </section>
    <section aria-live="polite" aria-labelledby="day-orders-title">
      <h3 id="day-orders-title" className="display text-2xl">{dateLabel(day)}</h3>
      <p className="mb-4 mt-2 text-sm font-semibold text-toy-ink/60">{dayOrders.length} pedido{dayOrders.length === 1 ? "" : "s"} para este día. Pulsa uno para ver el detalle completo.</p>
      <div className="grid gap-3">{dayOrders.map((order) => <OrderRow key={order.id} order={order} onOpen={onOpen} />)}</div>
      {!dayOrders.length && <p className="rounded-2xl bg-white p-5 text-sm font-medium text-toy-ink/60">No hay pedidos para esta fecha.</p>}
    </section>
  </div>;
}

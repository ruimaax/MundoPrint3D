export type Order = {
  name: string;
  phone?: string;
  section: string;
  color: string;
  answers: { label: string; value: string }[];
  when?: string;
  /** Fecha civil, sin conversión a UTC. */
  dueDate?: string;
};

export const ORDER_STATUSES = {
  pending: "Pendiente",
  in_progress: "En preparación",
  completed: "Terminado",
  cancelled: "Cancelado",
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;
export type StoredOrder = Order & {
  id: string;
  createdAt: string;
  status: OrderStatus;
};

export function isPending(order: StoredOrder): boolean {
  return order.status === "pending" || order.status === "in_progress";
}

export function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function dateLabel(value: string): string {
  return new Date(`${value}T12:00:00`).toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

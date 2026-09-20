import type { Metadata } from "next";
import AdminPanel from "../components/AdminPanel";

export const metadata: Metadata = {
  title: "Panel — Mundo Print 3D",
  robots: { index: false, follow: false },
};

// Panel de administración. En producción esta ruta y /admin/api/* están
// protegidas con Cloudflare Access (el cliente entra con un código que le
// llega por email).
export default function AdminPage() {
  return <AdminPanel />;
}

import type { Metadata } from "next";
import AdminPanel from "../components/AdminPanel";

export const metadata: Metadata = {
  title: "Panel — Mundo Print 3D",
  robots: { index: false, follow: false },
};

// El worker protege /admin/api/* con la sesión firmada del panel.
export default function AdminPage() {
  return <AdminPanel />;
}

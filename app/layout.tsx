import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "Mundo Print 3D — Diseño e impresión 3D a medida",
  description:
    "Piezas personalizadas, regalos, prototipos y series pequeñas en impresión 3D. Envía tu idea mediante foto o enlace y pide presupuesto.",
  keywords: ["impresión 3D", "diseño 3D", "piezas personalizadas", "prototipos", "regalos personalizados"],
  openGraph: {
    title: "Mundo Print 3D",
    description: "Tu mundo, impreso. Diseño e impresión 3D a medida.",
    images: ["/brand/mundo-print-3d-original.jpeg"],
    locale: "es_ES",
    type: "website",
  },
  icons: {
    icon: "/brand/mundo-print-3d-logo.png",
    apple: "/brand/mundo-print-3d-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Anton, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mundoprint3d.com",
  ),
  title: "Funkos personalizados en 3D",
  description:
    "Funkos con tu cara, tu mascota hecha figura, rótulos, llaveros y piezas a medida impresas en 3D. Míralo en el catálogo y pídelo por WhatsApp.",
  keywords: [
    "funkos personalizados",
    "impresión 3D",
    "regalos personalizados",
    "funko de mascota",
    "funko semana santa",
    "rótulos 3D",
  ],
  openGraph: {
    title: "Mundo Print 3D",
    description: "Funkos personalizados y regalos únicos impresos en 3D.",
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
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}

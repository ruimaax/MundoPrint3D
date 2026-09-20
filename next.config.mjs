/** @type {import('next').NextConfig} */
const nextConfig = {
  // La web es 100% estática: `next build` genera la carpeta /out y
  // Cloudflare la publica tal cual (ver wrangler.jsonc).
  output: "export",
  // `npm run cf:dev` compila (y exporta) en .next-cf para no chocar con
  // `npm run dev`; en producción no se toca y la web sale en /out.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: { unoptimized: true },
};

export default nextConfig;

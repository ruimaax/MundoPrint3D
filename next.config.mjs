/** @type {import('next').NextConfig} */
const nextConfig = {
  // La web es 100% estática: `next build` genera la carpeta /out y
  // Cloudflare la publica tal cual (ver wrangler.jsonc).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;

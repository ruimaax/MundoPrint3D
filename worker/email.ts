// Correo que llega al taller cuando alguien rellena el formulario de pedido.
// Maquetado con tablas y estilos en línea, que es lo único que respetan por
// igual Gmail, Outlook y el Mail del iPhone.

export type Order = {
  name: string;
  phone?: string;
  /** Sección elegida en el paso 1 ("Funkos personalizados", "Otro"…). */
  section: string;
  /** Color de la sección, para la etiqueta. */
  color: string;
  /** Respuestas del paso 2, en el orden del formulario. */
  answers: { label: string; value: string }[];
  /** "15 de octubre de 2026" o "Sin prisa". */
  when?: string;
};

const INK = "#201436";
const PAPER = "#f7ede0";
const CREAM = "#fff6ea";
const YELLOW = "#ffc400";
const GREEN = "#10b981";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Saltos de línea del cliente → <br>, ya escapados.
const multiline = (s: string) => esc(s).replace(/\r?\n/g, "<br>");

// Texto oscuro sobre colores claros (amarillo) y blanco sobre el resto.
function inkOn(color: string): string {
  const n = parseInt(color.slice(1), 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 160 ? INK : "#ffffff";
}

// Número para wa.me: solo dígitos y, si es un móvil español sin prefijo, +34.
export function waNumber(phone: string): string | null {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (/^[67]\d{8}$/.test(d)) d = `34${d}`;
  return d.length >= 9 && d.length <= 15 ? d : null;
}

function row(label: string, value: string, last = false): string {
  return `
            <tr>
              <td style="padding:14px 0;${last ? "" : "border-bottom:1px solid #eadfce;"}">
                <div style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#8a7f96;">${esc(label)}</div>
                <div style="margin-top:5px;font-size:16px;line-height:1.5;font-weight:600;color:${INK};">${multiline(value)}</div>
              </td>
            </tr>`;
}

// El logo va incrustado en el propio correo (adjunto con Content-ID): así se
// ve siempre, sin depender de que la web esté publicada ni de que Gmail
// cargue imágenes externas.
export const LOGO_CID = "logo-mundoprint3d";

export function buildOrderEmail(
  order: Order,
  siteUrl: string,
  { logoSrc = `cid:${LOGO_CID}`, sentAt = new Date() }: { logoSrc?: string; sentAt?: Date } = {},
) {
  const wa = order.phone ? waNumber(order.phone) : null;
  const pillInk = inkOn(order.color);
  const date = sentAt.toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const rows = [
    ...order.answers.map((a) => [a.label, a.value] as const),
    ...(order.when ? [["Lo necesita para", order.when] as const] : []),
  ];

  const subject = `Nuevo pedido: ${order.section} · ${order.name}`;
  const preheader = `${order.name} quiere ${order.section.toLowerCase()}${order.when ? ` para ${order.when.toLowerCase()}` : ""}.`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
    <tr>
      <td align="center" style="padding:28px 14px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

          <!-- cabecera -->
          <tr>
            <td style="background:${INK};border-radius:22px 22px 0 0;padding:26px 28px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td valign="middle">
                  <div style="font-size:16px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${YELLOW};">&#9733; Nuevo pedido</div>
                  <div style="margin-top:8px;font-family:Impact,'Arial Narrow Bold','Helvetica Neue',sans-serif;font-size:30px;line-height:1.05;text-transform:uppercase;color:#ffffff;">${esc(order.name)} quiere un encargo</div>
                </td>
                <td width="76" valign="top" align="right" style="padding-left:14px;">
                  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                    <td style="background:#ffffff;border-radius:14px;padding:5px 6px;">
                      <img src="${esc(logoSrc)}" width="64" height="56" alt="Mundo Print 3D" style="display:block;border:0;width:64px;height:56px;">
                    </td>
                  </tr></table>
                </td>
              </tr></table>
            </td>
          </tr>

          <!-- franja de colores de la marca -->
          <tr>
            <td style="font-size:0;line-height:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td height="7" style="background:#ff3b2e;width:25%;"></td>
                <td height="7" style="background:${YELLOW};width:25%;"></td>
                <td height="7" style="background:#1f45ff;width:25%;"></td>
                <td height="7" style="background:#ff3d8b;width:25%;"></td>
              </tr></table>
            </td>
          </tr>

          <!-- cuerpo -->
          <tr>
            <td style="background:${CREAM};padding:26px 28px 8px;">
              <div style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#8a7f96;">Quiere</div>
              <div style="margin-top:8px;">
                <span style="display:inline-block;padding:8px 16px;border-radius:999px;background:${order.color};color:${pillInk};font-size:15px;font-weight:800;">${esc(order.section)}</span>
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">${rows.map(([l, v], i) => row(l, v, i === rows.length - 1)).join("")}
              </table>
            </td>
          </tr>

          <!-- datos de contacto -->
          <tr>
            <td style="background:${CREAM};padding:6px 28px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:2px solid #eadfce;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#8a7f96;">Contacto</div>
                    <div style="margin-top:5px;font-size:17px;font-weight:800;color:${INK};">${esc(order.name)}</div>
                    <div style="margin-top:2px;font-size:15px;font-weight:600;color:${INK};">${
                      order.phone ? esc(order.phone) : `<span style="color:#8a7f96;font-weight:500;">No ha dejado móvil: te escribirá por WhatsApp.</span>`
                    }</div>
                    ${
                      wa
                        ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:16px;"><tr>
                      <td style="border-radius:999px;background:${GREEN};">
                        <a href="https://wa.me/${wa}?text=${encodeURIComponent(`¡Hola ${order.name}! Te escribo de Mundo Print 3D por tu pedido de ${order.section}.`)}" style="display:inline-block;padding:13px 24px;font-size:15px;font-weight:800;color:#ffffff;text-decoration:none;">Responder por WhatsApp &rarr;</a>
                      </td>
                    </tr></table>`
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- pie -->
          <tr>
            <td style="background:${INK};border-radius:0 0 22px 22px;padding:18px 28px;">
              <div style="font-size:13px;line-height:1.5;color:rgba(255,255,255,0.7);">
                Recibido el ${esc(date)} desde el formulario de
                <a href="${esc(siteUrl)}" style="color:${YELLOW};text-decoration:none;font-weight:700;">la web</a>.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Nuevo pedido desde la web`,
    ``,
    `Quiere: ${order.section}`,
    ...rows.map(([l, v]) => `${l}: ${v}`),
    ``,
    `Contacto: ${order.name}${order.phone ? ` · ${order.phone}` : " (sin móvil, escribirá por WhatsApp)"}`,
    ...(wa ? [`Responder: https://wa.me/${wa}`] : []),
    ``,
    `Recibido el ${date}.`,
  ].join("\n");

  return { subject, html, text };
}

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const projectType = String(form.get("projectType") || "").trim();
    const details = String(form.get("details") || "").trim();
    const quantity = String(form.get("quantity") || "").trim();
    const referenceLink = String(form.get("referenceLink") || "").trim();
    const file = form.get("file");

    if (!name || !email || !projectType || !details) {
      return NextResponse.json({ error: "Completa los campos obligatorios." }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Introduce un email válido." }, { status: 400 });
    }

    if (file instanceof File && file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "El archivo supera los 10 MB." }, { status: 413 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.QUOTE_EMAIL_TO;
    const from = process.env.RESEND_FROM_EMAIL || "Mundo Print 3D <onboarding@resend.dev>";

    if (!apiKey || !emailTo) {
      return NextResponse.json(
        { error: "El formulario está listo, pero falta configurar el email de recepción." },
        { status: 503 },
      );
    }

    const attachments = [];
    if (file instanceof File && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({ filename: file.name, content: buffer.toString("base64") });
    }

    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      projectType: escapeHtml(projectType),
      details: escapeHtml(details).replaceAll("\n", "<br>"),
      quantity: escapeHtml(quantity || "No indicada"),
      referenceLink: escapeHtml(referenceLink || "No incluido"),
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [emailTo],
        reply_to: email,
        subject: `Nuevo encargo: ${projectType} — ${name}`,
        html: `<h1>Nueva idea para Mundo Print 3D</h1><p><strong>Nombre:</strong> ${safe.name}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Tipo:</strong> ${safe.projectType}</p><p><strong>Cantidad:</strong> ${safe.quantity}</p><p><strong>Enlace:</strong> ${safe.referenceLink}</p><p><strong>Detalles:</strong><br>${safe.details}</p>`,
        attachments,
      }),
    });

    if (!response.ok) {
      console.error("Resend error", response.status, await response.text());
      return NextResponse.json({ error: "No se pudo enviar ahora mismo. Inténtalo de nuevo en unos minutos." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Quote form error", error);
    return NextResponse.json({ error: "Ha ocurrido un error al procesar el formulario." }, { status: 500 });
  }
}

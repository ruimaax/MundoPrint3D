# Panel de administración (/admin)

El cliente entra en `/admin` y puede:

- crear, renombrar, ordenar y borrar **secciones** (cada una es una tarjeta del catálogo),
- cambiar la **portada** de cada sección,
- subir y quitar **fotos** de cada sección (salen en la vitrina),
- cambiar el **formulario de pedido** de cada sección: añadir, quitar, ordenar
  y renombrar las preguntas del paso 2 (texto corto, texto largo, desplegable
  o número) y marcar las obligatorias. Las secciones que no se han tocado usan
  las preguntas de siempre (`formOf` en `app/data/catalog.ts`); el botón
  *Volver a las de siempre* las recupera.

Todo se guarda al momento en Workers KV (plan gratuito de Cloudflare, sin
tarjeta) y la web lo muestra al recargar.
Las fotos se reducen en el navegador (máx. 1600 px, WebP) antes de subirlas.

## Cómo funciona

- `worker/index.ts`: worker de Cloudflare. Sirve la web estática (`out/`) y la API:
  - `GET /api/catalog`: catálogo público.
  - `GET /img/...`: imágenes subidas.
  - `/admin/api/login` y `/admin/api/logout`: entrar y salir del panel.
  - `/admin/api/*` (el resto): guardar el catálogo y subir o borrar imágenes.
    Solo funcionan con la sesión iniciada.
- `app/data/catalog.ts`: tipos y catálogo inicial (semilla). Se usa mientras
  KV no tenga `catalog.json` y como respaldo si la API falla.
- `app/components/AdminPanel.tsx`: la interfaz del panel.

Límites del plan gratuito de KV: 1 GB en total, 1000 escrituras al día y
25 MB por imagen. De sobra para este uso (el panel reduce las fotos a ~200 KB).
Una foto recién subida puede tardar unos segundos en verse desde otros países.

## Puesta en marcha (una sola vez)

1. **Crear el almacén** (antes del primer despliegue):

   ```bash
   npx wrangler kv namespace create STORE
   ```

   Copia el `id` que devuelve y pégalo en `wrangler.jsonc`, en `kv_namespaces`.
   (El id que viene puesto es de mentira: sirve solo para las pruebas en local.)

2. **Poner la contraseña del panel** (es la que le das al cliente):

   ```bash
   npx wrangler secret put ADMIN_PASSWORD
   ```

   Se guarda cifrada en Cloudflare; no aparece en el repositorio ni en el código.
   Para cambiarla, se repite el comando (las sesiones abiertas se cierran solas).

   Mientras no exista, la web pública funciona igual, pero el panel no deja
   guardar nada (responde 503).

## Cómo entra el cliente

Va a `https://<la-web>/admin`, escribe la contraseña y entra. La sesión dura
30 días en ese dispositivo (cookie firmada, sin datos guardados en el servidor).
El botón *Salir* la cierra. Tras 10 intentos fallidos, esa IP espera 10 minutos.

## Probar en local

```bash
npm run cf:dev
```

Genera la web y arranca el worker en http://localhost:8787 con un KV simulado
(los datos quedan en la carpeta `.wrangler/`, no tocan la web real).
El archivo `.dev.vars` (no se sube a git) lleva `DEV_ADMIN=1`, que entra al
panel **sin contraseña solo en local**. Nunca pongas `DEV_ADMIN` en Cloudflare.
Para probar el login en local, cambia `.dev.vars` por `ADMIN_PASSWORD=loquesea`.

Con `npm run dev` la web funciona con la semilla, pero el panel no, porque no hay API.

## Copia de los pedidos por correo

Cuando alguien envía el formulario, además de abrirse WhatsApp, el worker
(`POST /api/pedido`) manda una copia con plantilla HTML (`worker/email.ts`)
a `QUOTE_EMAIL_TO` a través de [Resend](https://resend.com). Si el correo
falla, el cliente no se entera: WhatsApp se abre igual.

- La clave de Resend es un secreto: `npx wrangler secret put RESEND_API_KEY`.
- El destino y el remitente están en `wrangler.jsonc` → `vars`.
- Freno al spam: campo trampa invisible y máximo 5 envíos por IP cada 10 minutos.

**Mientras el dominio no esté verificado en Resend**, el remitente tiene que
ser `onboarding@resend.dev` y solo se puede enviar al correo de la cuenta de
Resend. Para usar un remitente propio (p. ej. `pedidos@mundoprint3d.com`):
Resend → *Domains* → *Add domain*, añadir los registros DNS que indica y,
cuando salga *Verified*, cambiar `QUOTE_EMAIL_FROM` en `wrangler.jsonc`.

Para probarlo en local con `npm run cf:dev`, añade `RESEND_API_KEY=...` a
`.dev.vars` (ese archivo no se sube a git).

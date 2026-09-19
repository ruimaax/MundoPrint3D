// Datos de contacto del taller. Cambiar aquí y se actualiza toda la web.
export const PHONE = "34644195590";

export function waLink(message: string): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

export const WA_DEFAULT = waLink(
  "Hola, vengo de la web de Mundo Print 3D y quiero pedir un presupuesto.",
);

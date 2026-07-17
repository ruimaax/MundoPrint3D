import MiniFunko from "./MiniFunko";

const FAQ = [
  {
    q: "¿Qué foto necesitas para hacer mi funko?",
    a: "Con una foto de frente donde se te vea bien la cara me vale. Si además me mandas una de cuerpo entero o me dices cómo quieres que vaya vestido, mejor: así clavo la ropa, el pelo y los detalles.",
  },
  {
    q: "¿Cuánto tarda?",
    a: "Te respondo con precio y fecha en 24–48 horas. A partir de ahí, un encargo normal suele estar listo en unos días; si es para una fecha concreta (un cumpleaños, una boda), dímelo al pedirlo y lo organizo.",
  },
  {
    q: "¿Cuánto mide la figura?",
    a: "El tamaño típico de un funko es de unos 10 cm, pero se puede hacer más grande o más pequeño. Si tienes una medida en la cabeza, la comentamos y la ajusto.",
  },
  {
    q: "¿Se rompe con facilidad?",
    a: "No. Se imprime en plástico resistente pensado para manipularse y estar expuesto. No es un juguete para tirar contra la pared, pero aguanta perfectamente el uso normal y los viajes.",
  },
  {
    q: "¿Va pintado?",
    a: "Sí. Las piezas salen con su color y se repasan a mano antes de mandarlas. Cada figura se revisa una a una.",
  },
  {
    q: "¿Puedo pedir varias iguales?",
    a: "Claro. Desde una unidad hasta una serie entera para un evento, una boda o una tienda. Cuantas más piezas, mejor sale el precio por unidad.",
  },
  {
    q: "¿Y si lo que quiero no es un funko?",
    a: "También. Llaveros, rótulos, decoración, recambios de piezas que ya no se venden… Si se puede imaginar, casi seguro que se puede imprimir. Cuéntamelo y te digo si es viable.",
  },
  {
    q: "¿Qué pasa con mi foto?",
    a: "Se usa solo para hacer tu pieza y no se comparte con nadie. Si quieres que no la publique en la galería ni en redes, dímelo y no aparece.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
          <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Dudas típicas</h2>
          <div className="funko-guide">
            <MiniFunko variant="guia" className="funko-idle w-16 shrink-0 sm:w-20" />
            <p className="speech">Si no está aquí, pregúntamelo por WhatsApp.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3" data-reveal>
          {FAQ.map((item) => (
            <details key={item.q} className="faq-item">
              <summary className="faq-q">
                <span className="font-display">{item.q}</span>
                <span className="faq-sign" aria-hidden />
              </summary>
              <p className="faq-a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

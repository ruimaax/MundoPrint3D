"use client";

import FunkoBoxes from "./FunkoBoxes";
import MiniFunko from "./MiniFunko";

export default function Catalog() {
  return (
    <section id="catalogo" className="scroll-mt-24 px-5 pb-20 pt-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4" data-reveal>
          <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Lo más pedido</h2>
          <div className="funko-guide">
            <MiniFunko variant="guia" className="funko-idle w-16 shrink-0 sm:w-20" />
            <p className="speech">Estos tres son los reyes del taller. Tocando cualquiera lo pides en un minuto.</p>
          </div>
        </div>

        <FunkoBoxes />
      </div>
    </section>
  );
}

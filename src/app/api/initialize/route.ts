// src/app/api/initialize/route.ts

import { NextResponse } from "next/server";

export async function POST() {
  const initialCanvas = {
    canvas: {
      content: {
        components: [
          {
            type: "text",
            id: "023",
            text: "Support-Escalation",
            align: "center",
            style: "header",
          },
          {
            type: "text",
            id: "tooltipTextAnalise",
            text: "Está acontecendo um incidente Crítico na Plataforma Digibee e Cliente já reportou no suporte. Precisa de uma análise para o entendimento da causa.",
            style: "paragraph",
          },
          {
            type: "button",
            label: "Precisa de uma análise imediata",
            style: "primary",
            id: "submit_button_pipeline",
            action: { type: "submit" },
          },
          {
            type: "text",
            id: "tooltipTextOcioso",
            text: "Aberto Ticket de Incidente - Cliente ocioso no chat (Cliente parou de responder ou não está colaborando com testes ou análises essenciais).",
            style: "paragraph",
          },
          {
            type: "button",
            label: "Cliente ocioso",
            style: "secondary",
            id: "submit_button_ocioso",
            action: { type: "submit" },
          },
          {
            type: "text",
            id: "clientesTexto",
            text: "(Fleury, HDI, Assaí, Redeban, Salon Line, Localiza, Itaú, Vivo, Mariner, Grupo El Comercio)",
            align: "center",
            style: "paragraph",
          },
        ],
      },
    },
  };

  return NextResponse.json(initialCanvas);
}

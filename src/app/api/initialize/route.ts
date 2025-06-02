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
            style: "header",
            align: "center",
          },
          {
            type: "button",
            id: "submit_button_pipeline",
            label: "Precisa de uma análise imediata",
            style: "primary",
            action: { type: "submit" },
          },
          {
            type: "button",
            id: "submit_button_ocioso",
            label: "Cliente ocioso",
            style: "secondary",
            action: { type: "submit" },
          },
          {
            type: "text",
            id: "clientesTexto",
            text: "(Fleury, HDI, Assaí, Redeban, Salon Line, Localiza, Itaú, Vivo, Mariner, Grupo El Comercio)",
            style: "label",
            align: "center",
          },
        ],
      },
    },
  };

  return NextResponse.json(initialCanvas);
}

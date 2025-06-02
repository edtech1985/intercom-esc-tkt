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
            type: "button",
            label: "Precisa de uma análise imediata",
            style: "primary",
            id: "submit_button_pipeline",
            action: { type: "submit" },
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
            style: "label",
          },
        ],
      },
    },
  };

  return NextResponse.json(initialCanvas);
}

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
            type: "single-select",
            id: "departmentChoice",
            label: "Escolha o tipo de escalonamento",
            options: [
              {
                type: "option",
                id: "001",
                text: "Precisa de uma análise imediata",
              },
              {
                type: "option",
                id: "002",
                text: "Cliente ocioso",
              },
            ],
          },
          {
            type: "button",
            label: "Escalar",
            style: "primary",
            id: "submit_button",
            action: { type: "submit" },
          },
          {
            type: "button",
            label: "Testar Análise Imediata",
            style: "secondary",
            id: "submit_button_pipeline",
            action: { type: "submit" },
          },
          {
            type: "button",
            label: "Testar Cliente ocioso",
            style: "secondary",
            id: "submit_button_ocioso",
            action: { type: "submit" },
          },
        ],
      },
    },
  };

  return NextResponse.json(initialCanvas);
}

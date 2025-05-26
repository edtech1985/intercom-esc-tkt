// /home/edtech1985/Documents/Digibee/app/intercom/intercom-esc-tkt/src/app/api/initialize/ route.ts

import { NextResponse } from "next/server";

export async function POST() {
  const initialCanvas = {
    canvas: {
      content: {
        components: [
          {
            type: "text",
            id: "department",
            text: "Você deseja escalar para qual departamento?",
            align: "center",
            style: "header",
          },
          {
            type: "checkbox",
            id: "departmentChoice",
            label: "",
            options: [
              {
                type: "option",
                id: "001",
                text: "Precisa de uma análise imediata",
              },
              { type: "option", id: "002", text: "Cliente ocioso" },
            ],
          },
          {
            type: "button",
            label: "Enviar",
            style: "primary",
            id: "submit_button",
            action: { type: "submit" },
          },
          {
            type: "button",
            label: "Chamar Pipeline",
            style: "secondary",
            id: "submit_button_pipeline",
            action: { type: "submit" },
          },
        ],
      },
    },
  };

  return NextResponse.json(initialCanvas);
}

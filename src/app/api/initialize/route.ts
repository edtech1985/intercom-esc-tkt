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
            type: "list",
            id: "024",
            label: "Escolha o tipo de escalonamento",
            single_selection: true,
            options: [
              {
                type: "option",
                id: "001",
                title: "Precisa de uma análise imediata",
              },
              {
                type: "option",
                id: "002",
                title: "Cliente ocioso",
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

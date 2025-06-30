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
            text: "Escalation Handling Scenarios",
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
        ],
      },
    },
  };

  return NextResponse.json(initialCanvas);
}

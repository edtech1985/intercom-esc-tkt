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
            text: "This contact works in:",
            align: "center",
            style: "header",
          },
          {
            type: "checkbox",
            id: "departmentChoice",
            label: "",
            options: [
              { type: "option", id: "csm", text: "CSM" },
              { type: "option", id: "products", text: "Produtos" },
              { type: "option", id: "support", text: "Suporte" },
              { type: "option", id: "clevel", text: "C-Level" },
            ],
          },
          {
            type: "button",
            label: "Submit",
            style: "primary",
            id: "submit_button",
            action: { type: "submit" },
          },
        ],
      },
    },
  };

  return NextResponse.json(initialCanvas);
}

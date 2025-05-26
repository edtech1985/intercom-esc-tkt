import { NextResponse } from "next/server";

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
            { type: "option", id: "sales", text: "Sales" },
            { type: "option", id: "operations", text: "Operations" },
            { type: "option", id: "engineering", text: "Engineering" },
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

export async function POST() {
  return NextResponse.json(initialCanvas);
}

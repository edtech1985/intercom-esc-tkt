import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received submit data:", body);

    const department = body.input_values?.departmentChoice || "None";

    const finalCanvas = {
      canvas: {
        content: {
          components: [
            {
              type: "text",
              id: "thanks",
              text: `You chose: ${department}`,
              align: "center",
              style: "header",
            },
            {
              type: "button",
              label: "Submit another",
              style: "primary",
              id: "refresh_button",
              action: { type: "submit" },
            },
          ],
        },
      },
    };

    return NextResponse.json(finalCanvas);
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process submit" },
      { status: 500 }
    );
  }
}

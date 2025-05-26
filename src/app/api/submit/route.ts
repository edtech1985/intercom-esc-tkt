// /home/edtech1985/Documents/Digibee/app/intercom/intercom-esc-tkt/src/app/api/submit/ route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Aqui você processa o payload enviado pelo Canvas, por exemplo:
    console.log("Received submit data:", body);

    // Resposta simples de confirmação para o Canvas
    return NextResponse.json({
      success: true,
      message: "Submit received successfully",
      data: body,
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process submit" },
      { status: 500 }
    );
  }
}

// src/app/api/initialize/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Capturar dados da conversa se disponíveis
    const conversation = body.conversation || {};
    const conversationId = conversation.id || "unknown";

    const initialCanvas = {
      canvas: {
        content: {
          components: [
            {
              type: "text",
              id: "header_main",
              text: "🎯 Escalation Handling Scenarios",
              style: "header",
              align: "center",
            },
            {
              type: "text",
              id: "subtitle",
              text: `Conversa: ${conversationId}`,
              style: "body",
              align: "center",
            },
            {
              type: "spacer",
              id: "spacer_main",
              size: "s",
            },
            {
              type: "button",
              id: "submit_button_pipeline",
              label: "🚨 Precisa de uma análise imediata",
              style: "primary",
              action: { type: "submit" },
            },
            {
              type: "button",
              id: "submit_button_ocioso",
              label: "😴 Cliente ocioso",
              style: "secondary",
              action: { type: "submit" },
            },
            {
              type: "spacer",
              id: "spacer_controls",
              size: "s",
            },
            {
              type: "text",
              id: "footer_info",
              text: "💡 O histórico das ações será exibido após a primeira interação",
              style: "body",
              align: "center",
            },
          ],
        },
      },
    };

    return NextResponse.json(initialCanvas);
  } catch (error) {
    console.error("Erro na inicialização:", error);

    return NextResponse.json({
      canvas: {
        content: {
          components: [
            {
              type: "text",
              id: "init_error",
              text: "❌ Erro ao inicializar o app",
              style: "error",
              align: "center",
            },
          ],
        },
      },
    });
  }
}

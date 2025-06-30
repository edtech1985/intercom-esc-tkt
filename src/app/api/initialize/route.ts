// src/app/api/initialize/route.ts
import { NextResponse } from "next/server";

// Definir tipos para o body da requisição do Intercom
interface IntercomRequestBody {
  conversation?: {
    id?: string;
  };
  admin?: {
    email?: string;
    name?: string;
  };
  contact?: {
    id?: string;
    email?: string;
  };
}

export async function POST(request: Request) {
  console.log("=== INITIALIZE REQUEST ===");

  try {
    // Verificar se há conteúdo no body antes de tentar fazer parse
    const contentLength = request.headers.get("content-length");
    const contentType = request.headers.get("content-type");

    console.log("Content-Length:", contentLength);
    console.log("Content-Type:", contentType);

    let body: IntercomRequestBody = {};

    // Só tentar fazer parse se houver conteúdo
    if (contentLength && parseInt(contentLength) > 0) {
      try {
        const textBody = await request.text();
        console.log("Raw body:", textBody);

        if (textBody.trim()) {
          body = JSON.parse(textBody) as IntercomRequestBody;
        }
      } catch (parseError) {
        console.warn(
          "Erro ao fazer parse do JSON, usando body vazio:",
          parseError
        );
        body = {};
      }
    } else {
      console.log("Body vazio ou sem content-length");
    }

    console.log("Parsed body:", JSON.stringify(body, null, 2));

    // Capturar dados da conversa se disponíveis
    const conversation = body.conversation || {};
    const conversationId = conversation.id || "unknown";
    const admin = body.admin || {};
    const adminEmail = admin.email || "unknown";

    console.log("Conversation ID:", conversationId);
    console.log("Admin email:", adminEmail);
    console.log("Criando canvas inicial...");

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
              type: "text",
              id: "admin_info",
              text: `Admin: ${adminEmail}`,
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

    console.log("Canvas criado com sucesso");
    console.log("Sending canvas response");

    const response = NextResponse.json(initialCanvas);

    // Headers necessários
    response.headers.set("Content-Type", "application/json");
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Body-Signature"
    );

    console.log("=== INITIALIZE SUCCESS ===");
    return response;
  } catch (error) {
    console.error("=== INITIALIZE ERROR ===");
    console.error("Error details:", error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    const errorResponse = NextResponse.json({
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
            {
              type: "text",
              id: "error_details",
              text: `Erro: ${
                error instanceof Error ? error.message : "Erro desconhecido"
              }`,
              style: "body",
              align: "center",
            },
            {
              type: "button",
              id: "retry_init",
              label: "🔄 Tentar Novamente",
              style: "primary",
              action: { type: "submit" },
            },
          ],
        },
      },
    });

    errorResponse.headers.set("Content-Type", "application/json");
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    errorResponse.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    errorResponse.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Body-Signature"
    );

    return errorResponse;
  }
}

// Handler para OPTIONS (preflight CORS)
export async function OPTIONS() {
  console.log("=== OPTIONS REQUEST (PREFLIGHT) ===");

  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Body-Signature",
      "Access-Control-Max-Age": "86400",
    },
  });
}

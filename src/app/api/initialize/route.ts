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
    // Verificar se há conteúdo no body
    const contentLength = request.headers.get("content-length");
    const contentType = request.headers.get("content-type");

    console.log("Content-Length:", contentLength);
    console.log("Content-Type:", contentType);

    let body: IntercomRequestBody = {};

    // Tentar fazer parse do body se houver conteúdo
    if (contentLength && parseInt(contentLength) > 0) {
      try {
        const textBody = await request.text();
        console.log("Raw body:", textBody);

        if (textBody.trim()) {
          body = JSON.parse(textBody) as IntercomRequestBody;
        }
      } catch (parseError) {
        console.warn("Erro ao fazer parse do JSON:", parseError);
        body = {};
      }
    } else {
      console.log("Body vazio ou sem content-length");
    }

    console.log("Parsed body:", JSON.stringify(body, null, 2));

    // Capturar dados da conversa se disponíveis
    const conversationId = body.conversation?.id || "unknown";
    const adminEmail = body.admin?.email || "unknown";

    console.log("Conversation ID:", conversationId);
    console.log("Admin email:", adminEmail);
    console.log("Criando canvas inicial...");

    // Canvas simplificado para teste
    const initialCanvas = {
      canvas: {
        content: {
          components: [
            {
              type: "text",
              id: "header_main",
              text: "Escalation Handling Scenarios",
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
              label: "Precisa de análise imediata",
              style: "primary",
              action: {
                type: "submit",
              },
            },
            {
              type: "button",
              id: "submit_button_ocioso",
              label: "Cliente ocioso",
              style: "secondary",
              action: {
                type: "submit",
              },
            },
            {
              type: "spacer",
              id: "spacer_controls",
              size: "s",
            },
            {
              type: "text",
              id: "footer_info",
              text: "O histórico das ações será exibido após a primeira interação",
              style: "body",
              align: "center",
            },
          ],
        },
      },
    };

    console.log("Canvas criado com sucesso");
    console.log("Sending canvas response");

    // Resposta simples sem headers CORS desnecessários
    const response = NextResponse.json(initialCanvas);
    response.headers.set("Content-Type", "application/json");

    console.log("=== INITIALIZE SUCCESS ===");
    return response;
  } catch (error) {
    console.error("=== INITIALIZE ERROR ===");
    console.error("Error details:", error);

    // Canvas de erro simplificado
    const errorResponse = NextResponse.json({
      canvas: {
        content: {
          components: [
            {
              type: "text",
              id: "init_error",
              text: "Erro ao inicializar o app",
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
          ],
        },
      },
    });

    errorResponse.headers.set("Content-Type", "application/json");
    return errorResponse;
  }
}

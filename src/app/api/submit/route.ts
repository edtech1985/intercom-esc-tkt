// src/app/api/submit/route.ts
import { NextResponse } from "next/server";

// Definir tipos para o body da requisição do Intercom
interface IntercomSubmitBody {
  component_id?: string;
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
  input_values?: Record<string, unknown>;
}

// Histórico em memória para demonstração
let actionHistory: Array<{
  action: string;
  status: "success" | "error";
  message: string;
  timestamp: string;
}> = [];

function addToHistory(
  action: string,
  status: "success" | "error",
  message: string = ""
) {
  actionHistory.push({
    action,
    status,
    message,
    timestamp: new Date().toLocaleString("pt-BR"),
  });

  // Manter apenas os últimos 10 registros
  if (actionHistory.length > 10) {
    actionHistory = actionHistory.slice(-10);
  }
}

function generateHistoryComponent() {
  if (actionHistory.length === 0) return null;

  return {
    type: "list",
    id: "action_history",
    items: actionHistory.map((item, index) => ({
      type: "item",
      id: `history_${index}`,
      title: `${item.status === "success" ? "✅" : "❌"} ${item.action}`,
      subtitle: `${item.timestamp}${item.message ? " - " + item.message : ""}`,
    })),
  };
}

export async function POST(request: Request) {
  console.log("=== SUBMIT REQUEST ===");

  try {
    // Verificar se há conteúdo no body antes de tentar fazer parse
    const contentLength = request.headers.get("content-length");
    const contentType = request.headers.get("content-type");

    console.log("Content-Length:", contentLength);
    console.log("Content-Type:", contentType);

    let body: IntercomSubmitBody = {};

    // Só tentar fazer parse se houver conteúdo
    if (contentLength && parseInt(contentLength) > 0) {
      try {
        const textBody = await request.text();
        console.log("Raw body:", textBody);

        if (textBody.trim()) {
          body = JSON.parse(textBody) as IntercomSubmitBody;
        }
      } catch (parseError) {
        console.warn(
          "Erro ao fazer parse do JSON, usando body vazio:",
          parseError
        );
        body = {};
      }
    }

    console.log("Parsed body:", JSON.stringify(body, null, 2));

    const componentId = body.component_id;
    const conversation = body.conversation || {};
    const admin = body.admin || {};
    const actionUserEmail = admin.email || "unknown";

    console.log("Component ID:", componentId);
    console.log("Action by:", actionUserEmail);

    // Metadata para enviar para os pipelines
    const metadata = {
      conversation_id: conversation.id,
      admin_email: actionUserEmail,
      timestamp: new Date().toISOString(),
    };

    // Botões de controle padrão
    const controlButtons = [
      {
        type: "button",
        id: "btn_new_action",
        label: "🆕 Nova Ação",
        style: "secondary",
        action: { type: "submit" },
      },
    ];

    // Handle para análise imediata
    if (componentId === "submit_button_pipeline") {
      try {
        console.log("Chamando pipeline de análise imediata...");

        const pipelineResponse = await fetch(
          "https://test.godigibee.io/pipeline/dgb-support-lab/v1/api-support-escalation/analise-imediata",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: "x8boiLS7n7vCGJfWbImOFmbtsqhbHgDA",
            },
            body: JSON.stringify({
              msg: "Análise imediata solicitada",
              metadata: metadata,
            }),
          }
        );

        if (!pipelineResponse.ok) {
          throw new Error(
            `Pipeline retornou status ${pipelineResponse.status}`
          );
        }

        const result = await pipelineResponse.json();
        console.log("Pipeline response:", result);

        addToHistory(
          "Análise imediata",
          "success",
          result.message || "Processado com sucesso"
        );

        return NextResponse.json({
          canvas: {
            content: {
              components: [
                {
                  type: "text",
                  id: "resultTextPipeline",
                  text: `✅ Escalation (análise imediata): ${
                    result.message || "Processado"
                  }`,
                  align: "center",
                  style: "header",
                },
                {
                  type: "text",
                  id: "action_by_pipeline",
                  text: `Ação executada por: ${actionUserEmail}`,
                  align: "center",
                  style: "body",
                },
                generateHistoryComponent(),
                {
                  type: "spacer",
                  id: "spacer2",
                  size: "s",
                },
                ...controlButtons,
              ].filter(Boolean),
            },
          },
        });
      } catch (error) {
        console.error("Erro no pipeline de análise imediata:", error);

        addToHistory(
          "Análise imediata",
          "error",
          error instanceof Error ? error.message : "Erro desconhecido"
        );

        return NextResponse.json({
          canvas: {
            content: {
              components: [
                {
                  type: "text",
                  id: "errorMessage",
                  text: "❌ Erro ao solicitar análise imediata",
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
                generateHistoryComponent(),
                {
                  type: "button",
                  id: "retry_pipeline",
                  label: "🔄 Tentar Novamente",
                  style: "primary",
                  action: { type: "submit" },
                },
                ...controlButtons,
              ].filter(Boolean),
            },
          },
        });
      }
    }

    // Handle para retry da análise imediata
    if (componentId === "retry_pipeline") {
      return POST({
        ...request,
        json: async () => ({ ...body, component_id: "submit_button_pipeline" }),
      } as Request);
    }

    // Handle para cliente ocioso
    if (componentId === "submit_button_ocioso") {
      try {
        console.log("Chamando pipeline de cliente ocioso...");

        const pipelineResponse = await fetch(
          "https://test.godigibee.io/pipeline/dgb-support-lab/v1/api-support-escalation/cliente-ocioso",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: "x8boiLS7n7vCGJfWbImOFmbtsqhbHgDA",
            },
            body: JSON.stringify({
              msg: "Cliente ocioso",
              metadata: metadata,
            }),
          }
        );

        if (!pipelineResponse.ok) {
          throw new Error(
            `Pipeline retornou status ${pipelineResponse.status}`
          );
        }

        const result = await pipelineResponse.json();
        console.log("Pipeline response:", result);

        addToHistory(
          "Cliente ocioso",
          "success",
          result.message || "Processado com sucesso"
        );

        return NextResponse.json({
          canvas: {
            content: {
              components: [
                {
                  type: "text",
                  id: "resultTextOcioso",
                  text: `✅ Escalation (cliente ocioso): ${
                    result.message || "Processado"
                  }`,
                  align: "center",
                  style: "header",
                },
                {
                  type: "text",
                  id: "action_by_ocioso",
                  text: `Ação executada por: ${actionUserEmail}`,
                  align: "center",
                  style: "body",
                },
                generateHistoryComponent(),
                {
                  type: "spacer",
                  id: "spacer3",
                  size: "s",
                },
                ...controlButtons,
              ].filter(Boolean),
            },
          },
        });
      } catch (error) {
        console.error("Erro no pipeline de cliente ocioso:", error);

        addToHistory(
          "Cliente ocioso",
          "error",
          error instanceof Error ? error.message : "Erro desconhecido"
        );

        return NextResponse.json({
          canvas: {
            content: {
              components: [
                {
                  type: "text",
                  id: "errorMessageOcioso",
                  text: "❌ Erro ao processar cliente ocioso",
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
                generateHistoryComponent(),
                {
                  type: "button",
                  id: "retry_ocioso",
                  label: "🔄 Tentar Novamente",
                  style: "primary",
                  action: { type: "submit" },
                },
                ...controlButtons,
              ].filter(Boolean),
            },
          },
        });
      }
    }

    // Handle para retry do cliente ocioso
    if (componentId === "retry_ocioso") {
      return POST({
        ...request,
        json: async () => ({ ...body, component_id: "submit_button_ocioso" }),
      } as Request);
    }

    // Handle para nova ação (voltar ao início)
    if (componentId === "btn_new_action" || componentId === "retry_init") {
      actionHistory = []; // Limpar histórico

      return NextResponse.json({
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
                text: `Conversa: ${conversation.id || "unknown"}`,
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
                text: "💡 Selecione uma ação de escalation",
                style: "body",
                align: "center",
              },
            ],
          },
        },
      });
    }

    // Componente não reconhecido
    console.warn("Componente não reconhecido:", componentId);
    addToHistory(`Ação desconhecida: ${componentId}`, "error");

    return NextResponse.json({
      canvas: {
        content: {
          components: [
            {
              type: "text",
              id: "unknown_action",
              text: "❓ Ação não reconhecida",
              style: "body",
              align: "center",
            },
            {
              type: "text",
              id: "component_id",
              text: `Component ID: ${componentId}`,
              style: "body",
              align: "center",
            },
            generateHistoryComponent(),
            ...controlButtons,
          ].filter(Boolean),
        },
      },
    });
  } catch (error) {
    console.error("=== SUBMIT ERROR ===");
    console.error("Error details:", error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json({
      canvas: {
        content: {
          components: [
            {
              type: "text",
              id: "system_error",
              text: "❌ Erro interno do sistema",
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
              id: "btn_new_action",
              label: "🔄 Reiniciar",
              style: "secondary",
              action: { type: "submit" },
            },
          ],
        },
      },
    });
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

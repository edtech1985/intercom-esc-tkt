// src/app/api/submit/route.ts

import { NextResponse } from "next/server";

// Simulando um storage simples para histórico (em produção use Redis, DB, etc.)
const actionHistory = new Map<
  string,
  Array<{
    timestamp: string;
    action: string;
    user_id: string;
    user_email: string;
    status: "success" | "error";
    details?: string;
  }>
>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const componentId = body.component_id;

    // Extrair dados principais
    const conversation = body.conversation || {};
    const contact = conversation.contact || body.contact || {};
    const user = body.user || {};
    const currentUser = body.current_user || body.admin || {}; // Quem clicou no botão

    // Dados essenciais
    const conversationId = conversation.id || "not provided";
    const adminAssigneeId = conversation.admin_assignee_id || "not assigned";
    const clientId = contact.id || user.id || "not provided";
    const clientEmail = contact.email || user.email || "not provided";
    const clientName = contact.name || user.name || "not provided";

    // Dados de quem executou a ação
    const actionUserId = currentUser.id || currentUser.user_id || "unknown";
    const actionUserEmail = currentUser.email || "unknown";
    const actionUserName = currentUser.name || "unknown";

    // Metadados para enviar
    const metadata = {
      conversation_id: conversationId,
      admin_assignee_id: adminAssigneeId,
      client: {
        id: clientId,
        email: clientEmail,
        name: clientName,
      },
      action_performed_by: {
        id: actionUserId,
        email: actionUserEmail,
        name: actionUserName,
      },
    };

    // Função para adicionar ao histórico
    const addToHistory = (
      action: string,
      status: "success" | "error",
      details?: string
    ) => {
      if (!actionHistory.has(conversationId)) {
        actionHistory.set(conversationId, []);
      }

      const history = actionHistory.get(conversationId)!;
      history.push({
        timestamp: new Date().toISOString(),
        action,
        user_id: actionUserId,
        user_email: actionUserEmail,
        status,
        details,
      });

      // Manter apenas os últimos 10 registros
      if (history.length > 10) {
        history.splice(0, history.length - 10);
      }
    };

    // Função para gerar histórico visual
    const generateHistoryComponent = () => {
      const history = actionHistory.get(conversationId) || [];
      if (history.length === 0) {
        return null;
      }

      const historyText = history
        .slice(-3) // Últimas 3 ações
        .map((item) => {
          const date = new Date(item.timestamp).toLocaleString("pt-BR");
          const status = item.status === "success" ? "✅" : "❌";
          return `${status} ${date} - ${item.action} (${item.user_email})`;
        })
        .join("\n");

      return {
        type: "text",
        id: "action_history",
        text: `📋 Últimas ações:\n${historyText}`,
        style: "body",
        align: "left",
      };
    };

    // Botões de controle
    const controlButtons = [
      {
        type: "button",
        id: "btn_restart_flow",
        label: "🔄 Reiniciar Fluxo",
        style: "secondary",
        action: { type: "submit" },
      },
    ];

    // Handle de reinício do fluxo
    if (componentId === "btn_restart_flow") {
      addToHistory("Fluxo reiniciado", "success");

      return NextResponse.json({
        canvas: {
          content: {
            components: [
              {
                type: "text",
                id: "restart_message",
                text: "🔄 Fluxo reiniciado com sucesso!",
                style: "header",
                align: "center",
              },
              generateHistoryComponent(),
              {
                type: "spacer",
                id: "spacer1",
                size: "s",
              },
              {
                type: "text",
                id: "header_text",
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
              ...controlButtons,
            ].filter(Boolean),
          },
        },
      });
    }

    // Handle para análise imediata
    if (componentId === "submit_button_pipeline") {
      try {
        const pipelineResponse = await fetch(
          "https://test.godigibee.io/pipeline/dgb-support-lab/v1/api-support-escalation/analise-imediata",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: "x8boiLS7n7vCGJfWbImOFmbtsqhbHgDA",
            },
            body: JSON.stringify({
              msg: "Solicitação de analise imediata",
              metadata: metadata,
            }),
          }
        );

        const result = await pipelineResponse.json();
        addToHistory("Análise imediata solicitada", "success", result.message);

        return NextResponse.json({
          canvas: {
            content: {
              components: [
                {
                  type: "text",
                  id: "resultTextPipeline",
                  text: `✅ Escalation (análise imediata): ${result.message}`,
                  align: "center",
                  style: "header",
                },
                {
                  type: "text",
                  id: "action_by",
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
      // Redireciona para o mesmo fluxo da análise imediata
      return POST({
        ...request,
        json: async () => ({ ...body, component_id: "submit_button_pipeline" }),
      } as Request);
    }

    // Handle para cliente ocioso
    if (componentId === "submit_button_ocioso") {
      try {
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

        const result = await pipelineResponse.json();
        addToHistory("Cliente ocioso processado", "success", result.message);

        return NextResponse.json({
          canvas: {
            content: {
              components: [
                {
                  type: "text",
                  id: "resultTextOcioso",
                  text: `✅ Escalation (cliente ocioso): ${result.message}`,
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

    // Componente não reconhecido
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
            generateHistoryComponent(),
            ...controlButtons,
          ].filter(Boolean),
        },
      },
    });
  } catch (error) {
    console.error("Erro no submit:", error);

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
              type: "button",
              id: "btn_restart_flow",
              label: "🔄 Reiniciar Fluxo",
              style: "secondary",
              action: { type: "submit" },
            },
          ],
        },
      },
    });
  }
}

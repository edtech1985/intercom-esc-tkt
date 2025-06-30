// src/app/api/submit/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const componentId = body.component_id;

    // Log completo do body para debug
    console.log("Body completo recebido:", JSON.stringify(body, null, 2));

    // Extrair metadados do usuário
    const user = body.user || {};
    const customAttributes = user.custom_attributes || {};

    // Extrair dados da conversa
    const conversation = body.conversation || {};
    const conversationMetadata = conversation.metadata || {};

    // Extrair dados do cliente/contato
    const contact = conversation.contact || body.contact || {};

    // IDs e informações principais
    const conversationId =
      conversation.id ||
      body.metadata?.conversation_id ||
      customAttributes.conversation_id ||
      "not provided";
    const adminAssigneeId =
      conversation.admin_assignee_id ||
      conversationMetadata.admin_assignee_id ||
      "not assigned";

    // Dados do cliente
    const clientId = contact.id || user.id || "not provided";
    const clientEmail = contact.email || user.email || "not provided";
    const clientName = contact.name || user.name || "not provided";

    // Compilar todos os metadados disponíveis
    const allMetadata = {
      conversation_id: conversationId,
      admin_assignee_id: adminAssigneeId,
      client: {
        id: clientId,
        email: clientEmail,
        name: clientName,
        custom_attributes: customAttributes,
      },
      conversation_metadata: conversationMetadata,
      conversation_state: conversation.state || "unknown",
      conversation_priority: conversation.priority || "normal",
      conversation_source: conversation.source || {},
      user_data: user,
      full_conversation_data: conversation,
      timestamp: new Date().toISOString(),
      // Capturar outros campos que possam existir
      raw_body: body,
    };

    // Log dos metadados estruturados
    console.log(
      "Metadados estruturados:",
      JSON.stringify(allMetadata, null, 2)
    );

    if (componentId === "submit_button_pipeline") {
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
            metadata: allMetadata, // Enviando todos os metadados
          }),
        }
      );

      const result = await pipelineResponse.json();

      return NextResponse.json({
        canvas: {
          content: {
            components: [
              {
                type: "text",
                id: "resultTextPipeline",
                text: `Escalation (análise imediata): ${result.message}`,
                align: "center",
                style: "header",
              },
              {
                type: "text",
                id: "metadataInfo",
                text: `Cliente: ${clientEmail} | Admin: ${adminAssigneeId} | Conversa: ${conversationId}`,
                align: "center",
                style: "body",
              },
            ],
          },
        },
      });
    }

    if (componentId === "submit_button_ocioso") {
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
            metadata: allMetadata, // Enviando todos os metadados
          }),
        }
      );

      const result = await pipelineResponse.json();

      return NextResponse.json({
        canvas: {
          content: {
            components: [
              {
                type: "text",
                id: "resultTextOcioso",
                text: `Escalation (cliente ocioso): ${result.message}`,
                align: "center",
                style: "header",
              },
              {
                type: "text",
                id: "metadataInfoOcioso",
                text: `Cliente: ${clientEmail} | Admin: ${adminAssigneeId} | Conversa: ${conversationId}`,
                align: "center",
                style: "body",
              },
            ],
          },
        },
      });
    }

    // Caso seja um componente não reconhecido, retornar os metadados para debug
    return NextResponse.json({
      canvas: {
        content: {
          components: [
            {
              type: "text",
              id: "debugInfo",
              text: "Componente não reconhecido. Verifique os logs do servidor para metadados completos.",
              align: "center",
              style: "body",
            },
          ],
        },
      },
      debug: {
        component_id: componentId,
        metadata: allMetadata,
      },
    });
  } catch (error) {
    console.error("Erro no submit:", error);
    return NextResponse.json(
      {
        error: "Falha ao processar o submit.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

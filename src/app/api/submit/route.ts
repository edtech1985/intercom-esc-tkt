// src/app/api/submit/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const componentId = body.component_id;

    // Extrair dados do payload
    const user = body.user || {};
    const admin = body.admin || {};
    const conversation = body.conversation || {};
    const customAttributes = user.custom_attributes || {};
    const contact = conversation.contact || body.contact || {};
    const conversationId =
      conversation.id ||
      body.metadata?.conversation_id ||
      customAttributes.conversation_id ||
      "not provided";
    const conversationDisplayId = conversation.display_id || "not available";
    const adminAssigneeId = conversation.admin_assignee_id || "not assigned";
    const clientId = contact.id || user.id || "not provided";
    const clientEmail = contact.email || user.email || "not provided";
    const clientName = contact.name || user.name || "not provided";

    // Construir objeto de metadados
    const metadata = {
      conversation_id: conversationId,
      conversation_display_id: conversationDisplayId,
      admin_assignee_id: adminAssigneeId,
      client: {
        id: clientId,
        email: clientEmail,
        name: clientName,
      },
      clicked_by: `${admin.name || admin.full_name || "unknown"}`, // nome do atendente que clicou
    };

    // Definições por botão
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
            msg: "Solicitação de análise imediata",
            metadata,
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
            metadata,
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
            ],
          },
        },
      });
    }

    // Caso nenhum botão seja identificado
    return NextResponse.json(
      { error: "Botão não reconhecido." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erro no submit:", error);
    return NextResponse.json(
      { error: "Falha ao processar o submit." },
      { status: 500 }
    );
  }
}

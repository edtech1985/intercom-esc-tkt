// src/app/api/submit/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const componentId = body.component_id;

    // Extrair dados principais de forma mais robusta
    const conversation = body.conversation || {};
    const contact = conversation.contact || body.contact || {};
    const user = body.user || {};
    const admin = body.admin || {};

    // Dados essenciais
    const conversationId = conversation.id || "not provided";
    const adminAssigneeId = conversation.admin_assignee_id || "not assigned";
    const clientId = contact.id || user.id || "not provided";
    const clientEmail = contact.email || user.email || "not provided";
    const clientName = contact.name || user.name || "not provided";

    // Dados de quem clicou no botão (admin/agente)
    const clickedByAdminId = admin.id || "not provided";
    const clickedByAdminEmail = admin.email || "not provided";
    const clickedByAdminName = admin.name || "not provided";

    // Metadados essenciais para enviar
    const metadata = {
      conversation_id: conversationId,
      admin_assignee_id: adminAssigneeId,
      client: {
        id: clientId,
        email: clientEmail,
        name: clientName,
      },
      clicked_by_admin: {
        id: clickedByAdminId,
        email: clickedByAdminEmail,
        name: clickedByAdminName,
      },
    };

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
            metadata: metadata,
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
            metadata: metadata,
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
  } catch (error) {
    console.error("Erro no submit:", error);
    return NextResponse.json(
      { error: "Falha ao processar o submit." },
      { status: 500 }
    );
  }
}

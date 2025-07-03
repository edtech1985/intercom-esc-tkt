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

    // Construir objeto de metadados
    const metadata = {
      conversation_id:
        conversation.id ||
        body.metadata?.conversation_id ||
        customAttributes.conversation_id ||
        "not provided",
      admin_assignee_id: conversation.assignee?.id || "not assigned",
      client: {
        id: user.id || "unknown",
        email: user.email || "unknown",
        name: `${user.name || user.full_name || "unknown"}`,
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

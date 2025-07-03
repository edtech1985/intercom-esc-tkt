// src/app/api/submit/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const componentId = body.component_id;

    // Extrair metadados do usuário
    const user = body.user || {};
    const customAttributes = user.custom_attributes || {};

    // Tenta extrair o conversation_id do body.conversation.id
    const conversationId =
      body.conversation?.id ||
      body.metadata?.conversation_id ||
      customAttributes.conversation_id ||
      "not provided";

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
            metadata: {
              conversation_id: conversationId,
            },
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
            metadata: {
              conversation_id: conversationId,
            },
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
                text: `Escalation(cliente ocioso): ${result.message}`,
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

// src/app/api/submit/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const componentId = body.component_id;
    const inputValues = body.input_values || {};

    // Extrair metadados do usuário
    const user = body.user || {};
    const customAttributes = user.custom_attributes || {};

    // Tenta extrair o conversation_id do body.conversation.id
    const conversationId =
      body.conversation?.id ||
      body.metadata?.conversation_id ||
      body.input_values?.conversation_id ||
      customAttributes.conversation_id ||
      "not provided";

    const contactType = customAttributes.contact_type || "not set";

    if (componentId === "submit_button_pipeline") {
      const pipelineResponse = await fetch(
        "http://test.godigibee.io/pipeline/dgb-support-lab/v1/analise-imediata",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: "Bearer x8boiLS7n7vCGJfWbImOFmbtsqhbHgDA",
          },
          body: JSON.stringify({
            msg: "teste analise imediata",
            metadata: {
              conversation_id: conversationId,
              contact_type: contactType,
              input_values: inputValues,
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
                text: `Resposta do pipeline (análise imediata): ${result.message}`,
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
        "http://test.godigibee.io/pipeline/dgb-support-lab/v1/cliente-ocioso",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: "Bearer x8boiLS7n7vCGJfWbImOFmbtsqhbHgDA",
          },
          body: JSON.stringify({
            msg: "",
            metadata: {
              conversation_id: conversationId,
              contact_type: contactType,
              input_values: inputValues,
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
                text: `Resposta do pipeline (cliente ocioso): ${result.message}`,
                align: "center",
                style: "header",
              },
            ],
          },
        },
      });
    }

    // Tratamento padrão do botão original
    const departmentChoice = inputValues.departmentChoice || [];

    return NextResponse.json({
      canvas: {
        content: {
          components: [
            {
              type: "text",
              id: "success",
              text: `Você selecionou: ${departmentChoice.join(", ")}`,
              align: "center",
              style: "header",
            },
          ],
        },
      },
    });
  } catch (error) {
    console.error("Erro no submit:", error);
    return NextResponse.json(
      { error: "Falha ao processar o submit." },
      { status: 500 }
    );
  }
}

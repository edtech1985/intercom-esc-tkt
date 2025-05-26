import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const componentId = body.component_id;
    const inputValues = body.input_values || {};

    // Extrair metadados do usuário
    const user = body.user || {};
    const userId = user.id || "unknown";
    const email = user.email || "unknown";
    const name = user.name || "unknown";
    const customAttributes = user.custom_attributes || {};
    const conversationId = customAttributes.conversation_id || "not provided";
    const contactType = customAttributes.contact_type || "not set";

    if (componentId === "submit_button_pipeline") {
      // Chamada ao pipeline com os metadados
      const pipelineResponse = await fetch(
        "http://test.godigibee.io/pipeline/dgb-support-lab/v1/api-internal-edson",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            msg: "edtech",
            metadata: {
              user_id: userId,
              email,
              name,
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
                id: "resultText",
                text: `Resposta do pipeline: ${result.message}`,
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

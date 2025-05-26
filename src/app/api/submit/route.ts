// /api/submit/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const componentId = body.component_id;

    // Verifica qual botão foi clicado
    if (componentId === "submit_button_pipeline") {
      const pipelineResponse = await fetch(
        "http://test.godigibee.io/pipeline/dgb-support-lab/v1/api-internal-edson",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ msg: "edtech" }),
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
    const inputValues = body.input_values || {};
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

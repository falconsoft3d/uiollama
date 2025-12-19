import { NextRequest, NextResponse } from "next/server";
import { verifyApiToken } from "@/lib/auth";

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://127.0.0.1:11434";

export async function POST(request: NextRequest) {
  // Verificar autenticación
  const authError = verifyApiToken(request);
  if (authError) {
    return authError;
  }
  try {
    const { messages, model } = await request.json();

    const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "llama2",
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const assistantMessage = data.message.content;

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error: any) {
    console.error("Error en la API de Ollama:", error);
    return NextResponse.json(
      { 
        error: "Error al procesar la solicitud. Asegúrate de que Ollama está ejecutándose.",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

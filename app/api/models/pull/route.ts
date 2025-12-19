import { NextRequest, NextResponse } from "next/server";
import { verifyApiToken } from "@/lib/auth";

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";

export async function POST(request: NextRequest) {
  // Verificar autenticación
  const authError = verifyApiToken(request);
  if (authError) {
    return authError;
  }
  try {
    const { model } = await request.json();

    if (!model) {
      return NextResponse.json(
        { error: "El nombre del modelo es requerido" },
        { status: 400 }
      );
    }

    const response = await fetch(`${OLLAMA_API_URL}/api/pull`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: model,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al descargar modelo: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      status: data.status,
    });
  } catch (error: any) {
    console.error("Error al descargar modelo:", error);
    return NextResponse.json(
      { 
        error: "Error al descargar el modelo",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

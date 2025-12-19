import { NextRequest, NextResponse } from "next/server";
import { verifyApiToken } from "@/lib/auth";

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://127.0.0.1:11434";

export async function GET(request: NextRequest) {
  // Verificar autenticación
  const authError = verifyApiToken(request);
  if (authError) {
    return authError;
  }
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener modelos: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      models: data.models || [],
    });
  } catch (error: any) {
    console.error("Error al obtener modelos:", error);
    return NextResponse.json(
      { 
        error: "Error al obtener la lista de modelos",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

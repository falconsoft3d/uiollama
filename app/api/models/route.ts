import { NextRequest, NextResponse } from "next/server";

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";

export async function GET() {
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

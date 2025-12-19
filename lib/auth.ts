import { NextRequest, NextResponse } from "next/server";

/**
 * Verifica si el token de API proporcionado es válido
 * @param request - La petición HTTP de Next.js
 * @returns NextResponse con error si el token es inválido, o null si es válido
 */
export function verifyApiToken(request: NextRequest): NextResponse | null {
  const API_TOKEN = process.env.API_TOKEN;
  
  // Si no hay token configurado, no requerir autenticación
  if (!API_TOKEN) {
    console.warn("⚠️ API_TOKEN no está configurado. La API está desprotegida.");
    return null;
  }

  // Obtener el token del header Authorization
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader) {
    return NextResponse.json(
      { 
        error: "No autorizado", 
        message: "Se requiere un token de autenticación en el header Authorization" 
      },
      { status: 401 }
    );
  }

  // Verificar formato Bearer token
  const token = authHeader.replace(/^Bearer\s+/i, "");
  
  if (!token) {
    return NextResponse.json(
      { 
        error: "No autorizado", 
        message: "Token de autenticación inválido" 
      },
      { status: 401 }
    );
  }

  // Verificar que el token coincida
  if (token !== API_TOKEN) {
    return NextResponse.json(
      { 
        error: "No autorizado", 
        message: "Token de autenticación incorrecto" 
      },
      { status: 403 }
    );
  }

  // Token válido
  return null;
}

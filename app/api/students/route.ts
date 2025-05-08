import { type NextRequest, NextResponse } from "next/server"
import { getAllStudents, saveStudent } from "@/lib/data-service"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
    }

    // Verificar permisos
    if (!["administrativo", "profesor"].includes(user.role)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    // Obtener parámetros de consulta
    const searchParams = request.nextUrl.searchParams
    const filters: Record<string, any> = {}

    // Aplicar filtros si existen
    const status = searchParams.get("status")
    if (status) {
      filters.status = status
    }

    const careerId = searchParams.get("careerId")
    if (careerId) {
      filters.careerId = careerId
    }

    // Obtener estudiantes
    const result = await getAllStudents(filters)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Error al obtener estudiantes:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
    }

    // Verificar permisos
    if (user.role !== "administrativo") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    // Obtener datos del estudiante
    const studentData = await request.json()

    // Guardar estudiante
    const result = await saveStudent(studentData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    console.error("Error al guardar estudiante:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, validatePassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Correo electrónico y contraseña son requeridos" }, { status: 400 })
    }

    // Buscar usuario por email
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Validar contraseña
    const isValidPassword = await validatePassword(user, password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Determinar el rol específico
    let specificRole = user.role
    let profileData = null

    if (user.student) {
      specificRole = "estudiante"
      profileData = {
        studentId: user.student.studentId,
        career: user.student.career?.name || "No asignada",
        status: user.student.status,
      }
    } else if (user.professor) {
      specificRole = "profesor"
      profileData = {
        professorId: user.professor.professorId,
        department: user.professor.department?.name || "No asignado",
        status: user.professor.status,
      }
    } else if (user.admin) {
      specificRole = "administrativo"
      profileData = {
        adminId: user.admin.adminId,
        position: user.admin.position,
        department: user.admin.department,
      }
    }

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: specificRole,
    })

    // Preparar respuesta
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: specificRole,
      profile: profileData,
    }

    return NextResponse.json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: userData,
      token,
    })
  } catch (error) {
    console.error("Error en inicio de sesión:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

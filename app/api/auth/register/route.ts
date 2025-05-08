import { type NextRequest, NextResponse } from "next/server"
import { createUser, checkUserExists } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json()

    // Validar campos requeridos
    const requiredFields = ["email", "password", "firstName", "lastName", "cedula", "role"]
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ error: `El campo ${field} es requerido` }, { status: 400 })
      }
    }

    // Verificar si el usuario ya existe
    const userExists = await checkUserExists(userData.email)
    if (userExists) {
      return NextResponse.json(
        {
          error: `El usuario con correo ${userData.email} ya existe`,
        },
        { status: 409 },
      )
    }

    // Crear el usuario
    const newUser = await createUser(userData)

    // Eliminar la contraseña del objeto de respuesta
    const { password, ...userWithoutPassword } = newUser

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "Usuario registrado exitosamente",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error al registrar usuario:", error)

    // Manejar errores específicos
    if (error.message?.includes("ya existe")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json(
      {
        error: "Error al registrar usuario",
      },
      { status: 500 },
    )
  }
}

import { prisma } from "./prisma"
import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"

// Constantes de seguridad
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-for-development-only"
const TOKEN_EXPIRY = "24h"
const SALT_ROUNDS = 10

// Tipos
export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  cedula: string
  birthDate?: Date
  gender?: string
  phone?: string
  address?: string
  role: string
}) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: userData.email }, { cedula: userData.cedula }],
      },
    })

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error(`El usuario con correo ${userData.email} ya existe`)
      } else {
        throw new Error(`El usuario con cédula ${userData.cedula} ya existe`)
      }
    }

    // Validar datos
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.cedula) {
      throw new Error("Faltan campos obligatorios")
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      throw new Error("Formato de correo electrónico inválido")
    }

    // Validar contraseña
    if (userData.password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres")
    }

    // Encriptar contraseña
    const hashedPassword = await hash(userData.password, SALT_ROUNDS)

    // Crear usuario
    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student: {
          include: {
            career: true,
          },
        },
        professor: {
          include: {
            department: true,
          },
        },
        admin: true,
      },
    })

    return user
  } catch (error) {
    console.error(`Error al buscar usuario por email ${email}:`, error)
    throw error
  }
}

export async function validatePassword(user: { password: string }, inputPassword: string) {
  try {
    if (!user || !user.password) {
      return false
    }

    return await compare(inputPassword, user.password)
  } catch (error) {
    console.error("Error al validar contraseña:", error)
    throw error
  }
}

export function generateToken(user: AuthUser) {
  try {
    return sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY },
    )
  } catch (error) {
    console.error("Error al generar token:", error)
    throw error
  }
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    console.error("Error al verificar token:", error)
    return null
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    })

    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    // Verificar contraseña actual
    const isValid = await compare(currentPassword, user.password)
    if (!isValid) {
      throw new Error("Contraseña actual incorrecta")
    }

    // Validar nueva contraseña
    if (newPassword.length < 8) {
      throw new Error("La nueva contraseña debe tener al menos 8 caracteres")
    }

    // Encriptar nueva contraseña
    const hashedPassword = await hash(newPassword, SALT_ROUNDS)

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return true
  } catch (error) {
    console.error("Error al cambiar contraseña:", error)
    throw error
  }
}

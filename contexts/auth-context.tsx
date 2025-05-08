"use client"

import { createContext, useState, useEffect, type ReactNode, useContext } from "react"
import { useRouter } from "next/navigation"
import { hasPermission as checkPermissionFn, getAccessibleModules, type UserRole } from "@/lib/auth-utils"

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  profile?: any
  token?: string
} | null

export interface AuthContextType {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  hasPermission: (module: string, action: "view" | "create" | "edit" | "delete") => boolean
  accessibleModules: string[]
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accessibleModules, setAccessibleModules] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const userData = localStorage.getItem("user")

        if (token && userData) {
          // En una aplicación real, validaríamos el token con el backend
          const parsedUser = JSON.parse(userData)
          setUser({ ...parsedUser, token })
          setAccessibleModules(getAccessibleModules(parsedUser.role))
        }
      } catch (error) {
        console.error("Authentication error:", error)
        setUser(null)
        setAccessibleModules([])
        // Limpiar datos de autenticación inválidos
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Intentar iniciar sesión con la API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store", // Evitar caché
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error de respuesta API:", response.status, errorData)

        // Modo de desarrollo: permitir inicio de sesión con credenciales hardcodeadas
        if (
          process.env.NODE_ENV === "development" &&
          ((email === "admin@universidad.edu" && password === "Admin123!") ||
            (email === "profesor@universidad.edu" && password === "Profesor123!") ||
            (email === "estudiante@universidad.edu" && password === "Estudiante123!"))
        ) {
          console.log("Usando modo de desarrollo para autenticación")

          // Crear usuario simulado basado en el email
          const mockUser = {
            id: "mock-id",
            email: email,
            firstName: email.startsWith("admin")
              ? "Administrador"
              : email.startsWith("profesor")
                ? "Juan"
                : "Ana María",
            lastName: email.startsWith("admin") ? "Sistema" : email.startsWith("profesor") ? "Pérez" : "Rodríguez",
            role: email.startsWith("admin")
              ? "administrativo"
              : email.startsWith("profesor")
                ? "profesor"
                : "estudiante",
            token: "mock-jwt-token",
          }

          // Guardar datos simulados
          localStorage.setItem("authToken", mockUser.token)
          localStorage.setItem("user", JSON.stringify(mockUser))

          setUser(mockUser)
          setAccessibleModules(getAccessibleModules(mockUser.role))
          setIsLoading(false)
          return true
        }

        setIsLoading(false)
        return false
      }

      const data = await response.json()

      if (!data.success || !data.token || !data.user) {
        console.error("Respuesta de API inválida:", data)
        setIsLoading(false)
        return false
      }

      // Guardar token y datos del usuario
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setUser({ ...data.user, token: data.token })
      setAccessibleModules(getAccessibleModules(data.user.role))
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Error al llamar a la API:", error)

      // Modo de desarrollo: permitir inicio de sesión con credenciales hardcodeadas
      if (
        process.env.NODE_ENV !== "production" &&
        ((email === "admin@universidad.edu" && password === "Admin123!") ||
          (email === "profesor@universidad.edu" && password === "Profesor123!") ||
          (email === "estudiante@universidad.edu" && password === "Estudiante123!"))
      ) {
        console.log("Usando modo de desarrollo para autenticación (fallback)")

        // Crear usuario simulado basado en el email
        const mockUser = {
          id: "mock-id",
          email: email,
          firstName: email.startsWith("admin") ? "Administrador" : email.startsWith("profesor") ? "Juan" : "Ana María",
          lastName: email.startsWith("admin") ? "Sistema" : email.startsWith("profesor") ? "Pérez" : "Rodríguez",
          role: email.startsWith("admin") ? "administrativo" : email.startsWith("profesor") ? "profesor" : "estudiante",
          token: "mock-jwt-token",
        }

        // Guardar datos simulados
        localStorage.setItem("authToken", mockUser.token)
        localStorage.setItem("user", JSON.stringify(mockUser))

        setUser(mockUser)
        setAccessibleModules(getAccessibleModules(mockUser.role as UserRole))
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setUser(null)
    setAccessibleModules([])

    // Usar setTimeout para mover la navegación fuera del ciclo de renderizado actual
    setTimeout(() => {
      router.push("/auth/login")
    }, 0)
  }

  const hasPermission = (module: string, action: "view" | "create" | "edit" | "delete"): boolean => {
    return checkPermissionFn(user?.role, module, action)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        hasPermission,
        accessibleModules,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Export the useAuth hook directly from this file
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

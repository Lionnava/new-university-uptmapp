"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

// Rutas que no requieren autenticación
const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"]

// Mapeo de rutas a roles permitidos
const roleRouteMap: Record<string, string[]> = {
  "/students": ["administrativo", "profesor"],
  "/academic": ["administrativo", "profesor"],
  "/teachers": ["administrativo", "profesor"],
  "/calendar": ["administrativo"],
  "/reports": ["administrativo", "profesor"],
  "/statistics": ["administrativo"],
  "/aspirants": ["administrativo"],
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Si está cargando, esperar
    if (isLoading) return

    // Si es una ruta pública, permitir acceso
    if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route))) {
      setIsAuthorized(true)
      return
    }

    // Si no está autenticado y no es una ruta pública, redirigir al login
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    // Si está autenticado y está en una ruta de autenticación, redirigir a la página principal
    if (isAuthenticated && publicRoutes.some((route) => pathname === route || pathname.startsWith(route))) {
      router.push("/")
      return
    }

    // Verificar permisos para la ruta
    const routePattern = Object.keys(roleRouteMap).find((route) => pathname.startsWith(route))

    if (routePattern) {
      const allowedRoles = roleRouteMap[routePattern]
      if (!user || !allowedRoles.includes(user.role)) {
        // Redirigir a la página principal si no tiene permisos
        router.push("/")
        return
      }
    }

    // Si pasa todas las verificaciones, está autorizado
    setIsAuthorized(true)
  }, [isLoading, isAuthenticated, pathname, router, user])

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si está autorizado, mostrar el contenido
  return <>{children}</>
}

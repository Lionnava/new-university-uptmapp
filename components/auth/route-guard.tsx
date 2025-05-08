"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

// Mapeo de rutas a módulos
const routeModuleMap: Record<string, { module: string; action: "view" | "create" | "edit" | "delete" }> = {
  "/": { module: "dashboard", action: "view" },
  "/students": { module: "students", action: "view" },
  "/teachers": { module: "professors", action: "view" },
  "/academic": { module: "subjects", action: "view" },
  "/calendar": { module: "periods", action: "view" },
  "/statistics": { module: "statistics", action: "view" },
  "/reports": { module: "reports", action: "view" },
  // Añadir más mapeos según sea necesario
}

interface RouteGuardProps {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, hasPermission } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    // Ignorar rutas de autenticación
    if (pathname.startsWith("/auth/")) {
      return
    }

    // Verificar autenticación
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    // Verificar permisos para la ruta actual
    const routeConfig =
      routeModuleMap[pathname] ||
      Object.entries(routeModuleMap).find(([route]) => pathname.startsWith(route) && route !== "/")?.[1]

    if (routeConfig) {
      const { module, action } = routeConfig
      if (!hasPermission(module, action)) {
        toast({
          variant: "destructive",
          title: "Acceso denegado",
          description: "No tienes permisos para acceder a esta sección.",
        })
        router.push("/")
      }
    }
  }, [pathname, isAuthenticated, hasPermission, router, toast])

  return <>{children}</>
}

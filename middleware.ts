import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

// Rutas que no requieren autenticación
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
]

// Mapeo de rutas a roles permitidos
const roleRouteMap: Record<string, string[]> = {
  "/students": ["administrativo", "profesor"],
  "/academic": ["administrativo", "profesor"],
  "/teachers": ["administrativo", "profesor"],
  "/calendar": ["administrativo"],
  "/reports": ["administrativo", "profesor"],
  "/statistics": ["administrativo"],
  "/aspirants": ["administrativo"],
  "/api/students": ["administrativo", "profesor"],
  "/api/professors": ["administrativo"],
  "/api/subjects": ["administrativo", "profesor"],
  "/api/sections": ["administrativo", "profesor"],
  "/api/periods": ["administrativo"],
  "/api/trajectories": ["administrativo"],
  "/api/enrollments": ["administrativo", "estudiante"],
  "/api/grades": ["administrativo", "profesor"],
  "/api/documents": ["administrativo", "profesor", "estudiante"],
  "/api/aspirants": ["administrativo"],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar si la ruta es pública
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Permitir acceso a archivos estáticos y recursos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Verificar autenticación para rutas de API
  if (pathname.startsWith("/api/")) {
    // Permitir rutas públicas de API
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    const token = request.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar token
    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
    }

    // Verificar permisos para la ruta
    const routePattern = Object.keys(roleRouteMap).find((route) => pathname.startsWith(route))

    if (routePattern) {
      const allowedRoles = roleRouteMap[routePattern]
      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
      }
    }

    return NextResponse.next()
  }

  // Para rutas de páginas, verificar si el usuario está autenticado
  const token = request.cookies.get("authToken")?.value

  if (!token) {
    // Redirigir al login si no hay token
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Verificar token
  const user = verifyToken(token)
  if (!user) {
    // Redirigir al login si el token es inválido
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Verificar permisos para la ruta
  const routePattern = Object.keys(roleRouteMap).find((route) => pathname.startsWith(route))

  if (routePattern) {
    const allowedRoles = roleRouteMap[routePattern]
    if (!allowedRoles.includes(user.role)) {
      // Redirigir a la página principal si no tiene permisos
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

// Configurar el middleware para que se ejecute solo en rutas específicas
export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}

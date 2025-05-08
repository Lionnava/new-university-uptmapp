/**
 * Prueba de navegación y enlaces
 * Este script verifica que las rutas y enlaces de la aplicación funcionen correctamente
 * Nota: Este script está diseñado para ejecutarse en un entorno de navegador
 */

// Función para verificar si una URL es accesible
async function checkUrl(url: string): Promise<{ url: string; status: number; ok: boolean }> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return {
      url,
      status: response.status,
      ok: response.ok,
    }
  } catch (error) {
    return {
      url,
      status: 0,
      ok: false,
    }
  }
}

// Función principal de prueba
async function testNavigation() {
  console.log("🧪 INICIANDO PRUEBAS DE NAVEGACIÓN Y ENLACES")
  console.log("===========================================")

  // Lista de rutas a verificar
  const routes = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/students",
    "/teachers",
    "/academic",
    "/calendar",
    "/reports",
    "/aspirants",
    "/statistics",
  ]

  // Prueba 1: Verificar accesibilidad de rutas principales
  console.log("Prueba 1: Verificar accesibilidad de rutas principales")

  const baseUrl = window.location.origin
  const results = []

  for (const route of routes) {
    const url = `${baseUrl}${route}`
    console.log(`   Verificando ruta: ${url}`)

    const result = await checkUrl(url)
    results.push(result)

    console.log(`   Resultado: ${result.ok ? "✅ ACCESIBLE" : "❌ NO ACCESIBLE"} (Status: ${result.status})`)
  }

  const accessibleCount = results.filter((r) => r.ok).length
  console.log(`\n   Resumen: ${accessibleCount} de ${routes.length} rutas son accesibles`)

  // Prueba 2: Verificar redirecciones de autenticación
  console.log("\nPrueba 2: Verificar redirecciones de autenticación")

  // Verificar si estamos autenticados
  const isAuthenticated = localStorage.getItem("authToken") !== null
  console.log(`   Estado de autenticación actual: ${isAuthenticated ? "Autenticado" : "No autenticado"}`)

  // Si no estamos autenticados, verificar redirección a login
  if (!isAuthenticated) {
    const protectedRoutes = ["/students", "/teachers", "/academic", "/calendar", "/reports", "/statistics"]

    for (const route of protectedRoutes) {
      const url = `${baseUrl}${route}`
      console.log(`   Verificando redirección de ruta protegida: ${url}`)

      try {
        // Intentar navegar a la ruta protegida
        const currentPath = window.location.pathname
        window.location.href = url

        // Esperar un momento para la redirección
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Verificar si fuimos redirigidos a login
        const redirectedToLogin = window.location.pathname.includes("/auth/login")
        console.log(`   Resultado: ${redirectedToLogin ? "✅ REDIRIGIDO A LOGIN" : "❌ NO REDIRIGIDO A LOGIN"}`)

        // Volver a la página original
        window.location.href = currentPath
      } catch (error) {
        console.error(`   Error al verificar redirección: ${error}`)
      }
    }
  } else {
    console.log("   Omitiendo prueba de redirección porque el usuario está autenticado")
  }

  console.log("\n✅ PRUEBAS DE NAVEGACIÓN COMPLETADAS")
}

// Esta función debe ejecutarse en un entorno de navegador
if (typeof window !== "undefined") {
  console.log("Ejecutando pruebas de navegación en el navegador...")
  testNavigation().catch(console.error)
} else {
  console.log("Las pruebas de navegación deben ejecutarse en un entorno de navegador")
}

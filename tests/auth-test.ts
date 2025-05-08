/**
 * Prueba de autenticación y autorización
 * Este script verifica el funcionamiento correcto del sistema de autenticación
 */

import { login, checkPermission } from "../lib/auth-utils"

async function testAuthentication() {
  console.log("🧪 INICIANDO PRUEBAS DE AUTENTICACIÓN")
  console.log("======================================")

  // Prueba 1: Login exitoso con credenciales de administrador
  try {
    console.log("Prueba 1: Login con credenciales de administrador")
    const adminResult = await login("admin@universidad.edu", "Admin123!")
    console.log(`✅ Resultado: ${adminResult.success ? "ÉXITO" : "FALLO"}`)
    console.log(`   Mensaje: ${adminResult.message}`)
    console.log(`   Usuario: ${adminResult.user ? JSON.stringify(adminResult.user) : "No disponible"}`)

    if (adminResult.user) {
      // Verificar permisos de administrador
      const canManageStudents = checkPermission(adminResult.user.role, "students", "edit")
      console.log(`   Permiso para gestionar estudiantes: ${canManageStudents ? "SÍ" : "NO"}`)
    }
  } catch (error) {
    console.error(`❌ Error en prueba 1: ${error}`)
  }

  // Prueba 2: Login exitoso con credenciales de profesor
  try {
    console.log("\nPrueba 2: Login con credenciales de profesor")
    const professorResult = await login("profesor@universidad.edu", "Profesor123!")
    console.log(`✅ Resultado: ${professorResult.success ? "ÉXITO" : "FALLO"}`)
    console.log(`   Mensaje: ${professorResult.message}`)

    if (professorResult.user) {
      // Verificar permisos de profesor
      const canViewGrades = checkPermission(professorResult.user.role, "grades", "view")
      const canEditAdmin = checkPermission(professorResult.user.role, "admin", "edit")
      console.log(`   Permiso para ver calificaciones: ${canViewGrades ? "SÍ" : "NO"}`)
      console.log(`   Permiso para editar configuración admin: ${canEditAdmin ? "SÍ" : "NO"}`)
    }
  } catch (error) {
    console.error(`❌ Error en prueba 2: ${error}`)
  }

  // Prueba 3: Login exitoso con credenciales de estudiante
  try {
    console.log("\nPrueba 3: Login con credenciales de estudiante")
    const studentResult = await login("estudiante@universidad.edu", "Estudiante123!")
    console.log(`✅ Resultado: ${studentResult.success ? "ÉXITO" : "FALLO"}`)
    console.log(`   Mensaje: ${studentResult.message}`)

    if (studentResult.user) {
      // Verificar permisos de estudiante
      const canViewOwnGrades = checkPermission(studentResult.user.role, "grades", "view")
      const canEditStudents = checkPermission(studentResult.user.role, "students", "edit")
      console.log(`   Permiso para ver calificaciones propias: ${canViewOwnGrades ? "SÍ" : "NO"}`)
      console.log(`   Permiso para editar estudiantes: ${canEditStudents ? "SÍ" : "NO"}`)
    }
  } catch (error) {
    console.error(`❌ Error en prueba 3: ${error}`)
  }

  // Prueba 4: Login fallido con credenciales incorrectas
  try {
    console.log("\nPrueba 4: Login con credenciales incorrectas")
    const failedResult = await login("usuario@incorrecto.com", "ContraseñaIncorrecta")
    console.log(`✅ Resultado esperado (fallo): ${!failedResult.success ? "ÉXITO" : "FALLO"}`)
    console.log(`   Mensaje: ${failedResult.message}`)
  } catch (error) {
    console.error(`❌ Error en prueba 4: ${error}`)
  }

  console.log("\n✅ PRUEBAS DE AUTENTICACIÓN COMPLETADAS")
}

// Ejecutar las pruebas
testAuthentication().catch(console.error)

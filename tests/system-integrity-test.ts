/**
 * Prueba de integridad del sistema
 * Este script verifica la integridad general del sistema y sus componentes
 */

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

// Función para verificar la existencia de archivos críticos
function checkCriticalFiles() {
  console.log("Verificando archivos críticos del sistema...")

  const criticalFiles = [
    // Archivos de configuración
    "next.config.mjs",
    "package.json",
    "tsconfig.json",
    "prisma/schema.prisma",
    ".env",

    // Archivos principales
    "app/layout.tsx",
    "app/page.tsx",
    "middleware.ts",

    // Servicios y utilidades
    "lib/prisma.ts",
    "lib/auth.ts",
    "lib/data-service.ts",
    "lib/report-service.ts",
    "lib/auth-utils.ts",

    // Componentes principales
    "components/ui/button.tsx",
    "components/navigation/main-nav.tsx",
    "components/navigation/user-nav.tsx",
    "components/auth/route-guard.tsx",

    // Páginas principales
    "app/auth/login/page.tsx",
    "app/students/page.tsx",
    "app/teachers/page.tsx",
    "app/academic/page.tsx",
    "app/aspirants/page.tsx",
    "app/reports/page.tsx",
  ]

  const missingFiles = []

  for (const file of criticalFiles) {
    const filePath = path.join(process.cwd(), file)
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file)
    }
  }

  if (missingFiles.length === 0) {
    console.log("✅ Todos los archivos críticos están presentes")
  } else {
    console.log(`❌ Faltan ${missingFiles.length} archivos críticos:`)
    missingFiles.forEach((file) => console.log(`   - ${file}`))
  }

  return missingFiles.length === 0
}

// Función para verificar dependencias
function checkDependencies() {
  console.log("\nVerificando dependencias del proyecto...")

  const requiredDependencies = [
    "next",
    "react",
    "react-dom",
    "@prisma/client",
    "bcryptjs",
    "jspdf",
    "exceljs",
    "docx",
    "file-saver",
    "html2canvas",
    "zod",
    "react-hook-form",
    "@hookform/resolvers",
  ]

  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"))
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

    const missingDependencies = []

    for (const dep of requiredDependencies) {
      if (!dependencies[dep]) {
        missingDependencies.push(dep)
      }
    }

    if (missingDependencies.length === 0) {
      console.log("✅ Todas las dependencias requeridas están instaladas")
    } else {
      console.log(`❌ Faltan ${missingDependencies.length} dependencias:`)
      missingDependencies.forEach((dep) => console.log(`   - ${dep}`))
    }

    return missingDependencies.length === 0
  } catch (error) {
    console.error("❌ Error al leer package.json:", error)
    return false
  }
}

// Función para verificar variables de entorno
function checkEnvironmentVariables() {
  console.log("\nVerificando variables de entorno...")

  const requiredEnvVars = [
    "DATABASE_URL",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_USER",
    "POSTGRES_HOST",
    "POSTGRES_PASSWORD",
    "POSTGRES_DATABASE",
  ]

  const missingEnvVars = []

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingEnvVars.push(envVar)
    }
  }

  if (missingEnvVars.length === 0) {
    console.log("✅ Todas las variables de entorno requeridas están configuradas")
  } else {
    console.log(`❌ Faltan ${missingEnvVars.length} variables de entorno:`)
    missingEnvVars.forEach((envVar) => console.log(`   - ${envVar}`))
  }

  return missingEnvVars.length === 0
}

// Función para verificar la estructura de la base de datos
function checkDatabaseSchema() {
  console.log("\nVerificando estructura de la base de datos...")

  try {
    // Ejecutar prisma db pull para verificar que la base de datos existe y es accesible
    execSync("npx prisma db pull --print", { stdio: "pipe" })
    console.log("✅ La base de datos es accesible y tiene una estructura válida")
    return true
  } catch (error) {
    console.error("❌ Error al verificar la estructura de la base de datos:", error)
    return false
  }
}

// Función para verificar la compilación del proyecto
function checkBuild() {
  console.log("\nVerificando compilación del proyecto...")

  try {
    // Ejecutar next build para verificar que el proyecto compila correctamente
    execSync("next build --no-lint", { stdio: "pipe" })
    console.log("✅ El proyecto compila correctamente")
    return true
  } catch (error) {
    console.error("❌ Error al compilar el proyecto:", error)
    return false
  }
}

// Función principal para ejecutar todas las verificaciones
async function testSystemIntegrity() {
  console.log("🧪 INICIANDO PRUEBAS DE INTEGRIDAD DEL SISTEMA")
  console.log("=============================================")

  const results = {
    files: checkCriticalFiles(),
    dependencies: checkDependencies(),
    envVars: checkEnvironmentVariables(),
    database: checkDatabaseSchema(),
    build: checkBuild(),
  }

  console.log("\n=============================================")
  console.log("RESUMEN DE INTEGRIDAD DEL SISTEMA:")
  console.log("=============================================")

  console.log(`Archivos críticos: ${results.files ? "✅ OK" : "❌ FALLOS"}`)
  console.log(`Dependencias: ${results.dependencies ? "✅ OK" : "❌ FALLOS"}`)
  console.log(`Variables de entorno: ${results.envVars ? "✅ OK" : "❌ FALLOS"}`)
  console.log(`Estructura de base de datos: ${results.database ? "✅ OK" : "❌ FALLOS"}`)
  console.log(`Compilación del proyecto: ${results.build ? "✅ OK" : "❌ FALLOS"}`)

  const overallResult = Object.values(results).every(Boolean)

  console.log("\n=============================================")
  if (overallResult) {
    console.log("✅ EL SISTEMA ESTÁ ÍNTEGRO Y LISTO PARA PRODUCCIÓN")
  } else {
    console.log("❌ EL SISTEMA TIENE PROBLEMAS QUE DEBEN RESOLVERSE")
  }
  console.log("=============================================")

  return overallResult
}

// Ejecutar las pruebas
testSystemIntegrity().catch(console.error)

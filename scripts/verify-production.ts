import { checkDatabaseConnection, disconnectDatabase } from "../lib/prisma"
import fs from "fs"
import path from "path"
import { execSync } from "child_process"

async function verifyProduction() {
  console.log("🔍 Iniciando verificación de producción...")

  // Verificar variables de entorno
  console.log("\n📋 Verificando variables de entorno...")
  const requiredEnvVars = [
    "DATABASE_URL",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_DATABASE",
    "POSTGRES_HOST",
    "JWT_SECRET",
  ]

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missingEnvVars.length > 0) {
    console.error("❌ Faltan las siguientes variables de entorno:")
    missingEnvVars.forEach((envVar) => console.error(`   - ${envVar}`))
    console.log("\n⚠️ Debes configurar estas variables antes de desplegar a producción.")
  } else {
    console.log("✅ Todas las variables de entorno requeridas están configuradas.")
  }

  // Verificar conexión a la base de datos
  console.log("\n📋 Verificando conexión a la base de datos...")
  const dbConnected = await checkDatabaseConnection()

  if (!dbConnected) {
    console.error("❌ No se pudo conectar a la base de datos.")
    console.log("\n⚠️ Verifica la configuración de la base de datos antes de desplegar a producción.")
  } else {
    console.log("✅ Conexión a la base de datos establecida correctamente.")
  }

  // Verificar dependencias
  console.log("\n📋 Verificando dependencias...")
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"))
    const dependencies = packageJson.dependencies || {}
    const devDependencies = packageJson.devDependencies || {}

    const requiredDependencies = ["@prisma/client", "next", "react", "react-dom", "bcryptjs", "jsonwebtoken"]

    const missingDependencies = requiredDependencies.filter((dep) => !dependencies[dep] && !devDependencies[dep])

    if (missingDependencies.length > 0) {
      console.error("❌ Faltan las siguientes dependencias:")
      missingDependencies.forEach((dep) => console.error(`   - ${dep}`))
      console.log("\n⚠️ Instala estas dependencias antes de desplegar a producción.")
    } else {
      console.log("✅ Todas las dependencias requeridas están instaladas.")
    }
  } catch (error) {
    console.error("❌ Error al verificar dependencias:", error)
  }

  // Verificar build
  console.log("\n📋 Verificando build de producción...")
  try {
    execSync("npm run build", { stdio: "inherit" })
    console.log("✅ Build de producción completado correctamente.")
  } catch (error) {
    console.error("❌ Error al generar el build de producción.")
    console.error(error)
  }

  // Cerrar conexión a la base de datos
  await disconnectDatabase()

  console.log("\n🏁 Verificación de producción completada.")
}

verifyProduction().catch(console.error)

import { execSync } from "child_process"
import { checkDatabaseConnection, disconnectDatabase } from "../lib/prisma"

async function deployProduction() {
  console.log("🚀 Iniciando despliegue a producción...")

  // Verificar que estamos en la rama principal
  try {
    const currentBranch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim()
    if (currentBranch !== "main" && currentBranch !== "master") {
      console.warn(`⚠️ No estás en la rama principal (estás en ${currentBranch}).`)
      const proceed = await promptYesNo("¿Deseas continuar con el despliegue?")
      if (!proceed) {
        console.log("❌ Despliegue cancelado.")
        return
      }
    }
  } catch (error) {
    console.warn("⚠️ No se pudo verificar la rama git. Asegúrate de estar en la rama principal.")
  }

  // Verificar cambios sin commit
  try {
    const status = execSync("git status --porcelain").toString().trim()
    if (status) {
      console.warn("⚠️ Tienes cambios sin commit:")
      console.log(status)
      const proceed = await promptYesNo("¿Deseas continuar con el despliegue?")
      if (!proceed) {
        console.log("❌ Despliegue cancelado.")
        return
      }
    }
  } catch (error) {
    console.warn("⚠️ No se pudo verificar el estado git.")
  }

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
    const proceed = await promptYesNo("¿Deseas continuar con el despliegue?")
    if (!proceed) {
      console.log("❌ Despliegue cancelado.")
      return
    }
  } else {
    console.log("✅ Todas las variables de entorno requeridas están configuradas.")
  }

  // Verificar conexión a la base de datos
  console.log("\n📋 Verificando conexión a la base de datos...")
  const dbConnected = await checkDatabaseConnection()

  if (!dbConnected) {
    console.error("❌ No se pudo conectar a la base de datos.")
    console.log("\n⚠️ Verifica la configuración de la base de datos antes de desplegar a producción.")
    const proceed = await promptYesNo("¿Deseas continuar con el despliegue?")
    if (!proceed) {
      console.log("❌ Despliegue cancelado.")
      return
    }
  } else {
    console.log("✅ Conexión a la base de datos establecida correctamente.")
  }

  // Ejecutar migraciones de base de datos
  console.log("\n📋 Ejecutando migraciones de base de datos...")
  try {
    execSync("npx prisma migrate deploy", { stdio: "inherit" })
    console.log("✅ Migraciones de base de datos ejecutadas correctamente.")
  } catch (error) {
    console.error("❌ Error al ejecutar migraciones de base de datos.")
    const proceed = await promptYesNo("¿Deseas continuar con el despliegue?")
    if (!proceed) {
      console.log("❌ Despliegue cancelado.")
      return
    }
  }

  // Generar build de producción
  console.log("\n📋 Generando build de producción...")
  try {
    execSync("npm run build", { stdio: "inherit" })
    console.log("✅ Build de producción generado correctamente.")
  } catch (error) {
    console.error("❌ Error al generar el build de producción.")
    console.log("❌ Despliegue cancelado.")
    return
  }

  // Cerrar conexión a la base de datos
  await disconnectDatabase()

  console.log("\n🎉 ¡Despliegue a producción completado con éxito!")
  console.log("\nPara iniciar el servidor en modo producción, ejecuta:")
  console.log("npm run start")
}

async function promptYesNo(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    process.stdout.write(`${question} (s/n): `)
    process.stdin.once("data", (data) => {
      const answer = data.toString().trim().toLowerCase()
      resolve(answer === "s" || answer === "si" || answer === "y" || answer === "yes")
    })
  })
}

deployProduction().catch(console.error)

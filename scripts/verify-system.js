#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
}

// Función para verificar si un archivo existe
function fileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath))
}

// Función para verificar si un directorio existe
function directoryExists(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath)
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()
}

// Función para verificar si un paquete está instalado
function packageInstalled(packageName) {
  try {
    require.resolve(packageName)
    return true
  } catch (e) {
    return false
  }
}

console.log(`${colors.cyan}=== Sistema de Gestión Universitaria - Verificación del Sistema ===${colors.reset}\n`)

// Verificar archivos críticos
console.log(`${colors.blue}Verificando archivos críticos...${colors.reset}`)
const criticalFiles = [
  "next.config.mjs",
  "package.json",
  "tsconfig.json",
  "app/layout.tsx",
  "app/page.tsx",
  "lib/prisma.ts",
  "prisma/schema.prisma",
]

let allFilesExist = true
for (const file of criticalFiles) {
  if (!fileExists(file)) {
    console.error(`${colors.red}❌ Archivo crítico no encontrado: ${file}${colors.reset}`)
    allFilesExist = false
  } else {
    console.log(`${colors.green}✅ Archivo crítico encontrado: ${file}${colors.reset}`)
  }
}

// Verificar directorios críticos
console.log(`\n${colors.blue}Verificando directorios críticos...${colors.reset}`)
const criticalDirectories = ["app", "components", "lib", "prisma", "public"]

let allDirectoriesExist = true
for (const dir of criticalDirectories) {
  if (!directoryExists(dir)) {
    console.error(`${colors.red}❌ Directorio crítico no encontrado: ${dir}${colors.reset}`)
    allDirectoriesExist = false
  } else {
    console.log(`${colors.green}✅ Directorio crítico encontrado: ${dir}${colors.reset}`)
  }
}

// Verificar dependencias críticas
console.log(`\n${colors.blue}Verificando dependencias críticas...${colors.reset}`)
const criticalDependencies = ["next", "react", "react-dom", "@prisma/client"]

let allDependenciesInstalled = true
for (const dep of criticalDependencies) {
  if (!packageInstalled(dep)) {
    console.error(`${colors.red}❌ Dependencia crítica no instalada: ${dep}${colors.reset}`)
    allDependenciesInstalled = false
  } else {
    console.log(`${colors.green}✅ Dependencia crítica instalada: ${dep}${colors.reset}`)
  }
}

// Verificar variables de entorno
console.log(`\n${colors.blue}Verificando variables de entorno...${colors.reset}`)
const requiredEnvVars = [
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
]

let allEnvVarsExist = true
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`${colors.yellow}⚠️ Variable de entorno no definida: ${envVar}${colors.reset}`)
    allEnvVarsExist = false
  } else {
    console.log(`${colors.green}✅ Variable de entorno definida: ${envVar}${colors.reset}`)
  }
}

// Verificar la conexión a la base de datos
console.log(`\n${colors.blue}Verificando conexión a la base de datos...${colors.reset}`)
try {
  execSync("npx prisma generate", { stdio: "inherit" })
  console.log(`${colors.green}✅ Prisma Client generado correctamente${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}❌ Error al generar Prisma Client: ${error.message}${colors.reset}`)
  process.exit(1)
}

// Resumen
console.log(`\n${colors.magenta}=== Resumen de la verificación ===${colors.reset}`)
console.log(
  `Archivos críticos: ${allFilesExist ? colors.green + "✅ Todos presentes" : colors.red + "❌ Faltan algunos"}${colors.reset}`,
)
console.log(
  `Directorios críticos: ${allDirectoriesExist ? colors.green + "✅ Todos presentes" : colors.red + "❌ Faltan algunos"}${colors.reset}`,
)
console.log(
  `Dependencias críticas: ${allDependenciesInstalled ? colors.green + "✅ Todas instaladas" : colors.red + "❌ Faltan algunas"}${colors.reset}`,
)
console.log(
  `Variables de entorno: ${allEnvVarsExist ? colors.green + "✅ Todas definidas" : colors.yellow + "⚠️ Faltan algunas"}${colors.reset}`,
)

// Resultado final
if (allFilesExist && allDirectoriesExist && allDependenciesInstalled) {
  console.log(`\n${colors.green}✅ El sistema está listo para producción!${colors.reset}`)
  process.exit(0)
} else {
  console.error(
    `\n${colors.red}❌ El sistema no está listo para producción. Corrija los problemas mencionados anteriormente.${colors.reset}`,
  )
  process.exit(1)
}

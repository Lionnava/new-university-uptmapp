#!/usr/bin/env node

import { execSync } from "child_process"
import fs from "fs"
import path from "path"

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

console.log(`${colors.bright}${colors.cyan}=== Iniciando Modo Preview del Sistema Universitario ===${colors.reset}\n`)

// Paso 1: Verificar dependencias
console.log(`${colors.yellow}[1/4]${colors.reset} Verificando dependencias...`)
try {
  // Verificar si cross-env está instalado
  try {
    require.resolve("cross-env")
    console.log(`${colors.green}✓${colors.reset} cross-env está instalado`)
  } catch (e) {
    console.log(`${colors.yellow}!${colors.reset} Instalando cross-env...`)
    execSync("npm install --save-dev cross-env", { stdio: "inherit" })
  }

  console.log(`${colors.green}✓${colors.reset} Todas las dependencias están instaladas\n`)
} catch (error) {
  console.error(`${colors.red}✗${colors.reset} Error al verificar dependencias:`, error)
  process.exit(1)
}

// Paso 2: Verificar archivos necesarios
console.log(`${colors.yellow}[2/4]${colors.reset} Verificando archivos necesarios...`)
const requiredFiles = [
  "app/preview/page.tsx",
  "lib/preview-utils.ts",
  "components/ui/tabs.tsx",
  "components/ui/card.tsx",
  "components/ui/alert.tsx",
]

let allFilesExist = true
for (const file of requiredFiles) {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`${colors.green}✓${colors.reset} ${file} existe`)
  } else {
    console.log(`${colors.red}✗${colors.reset} ${file} no existe`)
    allFilesExist = false
  }
}

if (!allFilesExist) {
  console.error(`${colors.red}Error:${colors.reset} Faltan archivos necesarios para el modo preview`)
  process.exit(1)
}

console.log(`${colors.green}✓${colors.reset} Todos los archivos necesarios están presentes\n`)

// Paso 3: Configurar variables de entorno
console.log(`${colors.yellow}[3/4]${colors.reset} Configurando variables de entorno...`)
process.env.NEXT_PUBLIC_PREVIEW_MODE = "true"
console.log(`${colors.green}✓${colors.reset} Variables de entorno configuradas\n`)

// Paso 4: Iniciar el servidor
console.log(`${colors.yellow}[4/4]${colors.reset} Iniciando servidor en modo preview...`)
console.log(`${colors.magenta}i${colors.reset} Una vez que el servidor esté en funcionamiento, accede a:`)
console.log(`${colors.bright}${colors.blue}   http://localhost:3000/preview${colors.reset}`)
console.log(`${colors.magenta}i${colors.reset} Presiona Ctrl+C para detener el servidor\n`)

try {
  execSync("npx cross-env NEXT_PUBLIC_PREVIEW_MODE=true next dev", { stdio: "inherit" })
} catch (error) {
  // No hacemos nada aquí porque Ctrl+C generará un error pero es el comportamiento esperado
}

console.log(`\n${colors.bright}${colors.cyan}=== Modo Preview finalizado ===${colors.reset}`)

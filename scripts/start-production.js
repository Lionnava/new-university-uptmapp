#!/usr/bin/env node

const { spawn } = require("child_process")
const path = require("path")
const fs = require("fs")

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

// Verificar si estamos en producción
const isProduction = process.env.NODE_ENV === "production"

// Puerto para el servidor
const PORT = process.env.PORT || 3000

console.log(`${colors.cyan}=== Sistema de Gestión Universitaria ===${colors.reset}`)
console.log(`${colors.blue}Iniciando servidor en modo ${isProduction ? "producción" : "desarrollo"}...${colors.reset}`)

// Verificar si el directorio .next existe
if (isProduction && !fs.existsSync(path.join(process.cwd(), ".next"))) {
  console.error(`${colors.red}Error: El directorio .next no existe. Ejecute "npm run build" primero.${colors.reset}`)
  process.exit(1)
}

// Comando para iniciar el servidor
const startCommand = isProduction ? "next start" : "next dev"

// Iniciar el servidor
const server = spawn("npx", startCommand.split(" ").concat(["-p", PORT.toString()]), {
  stdio: "inherit",
  env: { ...process.env, PORT: PORT.toString() },
})

// Manejar eventos del servidor
server.on("close", (code) => {
  console.log(`${colors.yellow}El servidor se ha detenido con código ${code}${colors.reset}`)
})

// Manejar señales para cerrar el servidor correctamente
process.on("SIGINT", () => {
  console.log(`${colors.yellow}Deteniendo el servidor...${colors.reset}`)
  server.kill("SIGINT")
})

process.on("SIGTERM", () => {
  console.log(`${colors.yellow}Deteniendo el servidor...${colors.reset}`)
  server.kill("SIGTERM")
})

console.log(`${colors.green}Servidor iniciado en http://localhost:${PORT}${colors.reset}`)
console.log(`${colors.magenta}Presione Ctrl+C para detener el servidor${colors.reset}`)

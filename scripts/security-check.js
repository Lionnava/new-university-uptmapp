const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

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

console.log(`${colors.blue}=== Iniciando verificación de seguridad ===${colors.reset}`)

// Verificar dependencias con npm audit
try {
  console.log(`${colors.cyan}Verificando vulnerabilidades en dependencias...${colors.reset}`)
  const auditOutput = execSync("npm audit --json").toString()
  const auditResult = JSON.parse(auditOutput)

  if (auditResult.metadata.vulnerabilities.total > 0) {
    console.log(
      `${colors.yellow}Se encontraron ${auditResult.metadata.vulnerabilities.total} vulnerabilidades:${colors.reset}`,
    )
    console.log(`- Críticas: ${auditResult.metadata.vulnerabilities.critical}`)
    console.log(`- Altas: ${auditResult.metadata.vulnerabilities.high}`)
    console.log(`- Medias: ${auditResult.metadata.vulnerabilities.moderate}`)
    console.log(`- Bajas: ${auditResult.metadata.vulnerabilities.low}`)

    // Mostrar detalles de las vulnerabilidades críticas y altas
    if (auditResult.metadata.vulnerabilities.critical > 0 || auditResult.metadata.vulnerabilities.high > 0) {
      console.log(`${colors.red}Detalles de vulnerabilidades críticas y altas:${colors.reset}`)
      Object.values(auditResult.vulnerabilities).forEach((vuln) => {
        if (vuln.severity === "critical" || vuln.severity === "high") {
          console.log(`- ${vuln.name}: ${vuln.severity} - ${vuln.title}`)
          console.log(`  ${vuln.url}`)
        }
      })
    }

    console.log(
      `${colors.yellow}Ejecute 'npm audit fix' para intentar resolver automáticamente las vulnerabilidades.${colors.reset}`,
    )
  } else {
    console.log(`${colors.green}No se encontraron vulnerabilidades en las dependencias.${colors.reset}`)
  }
} catch (error) {
  console.error(`${colors.red}Error al verificar vulnerabilidades:${colors.reset}`, error.message)
}

// Verificar configuraciones de seguridad
console.log(`\n${colors.cyan}Verificando configuraciones de seguridad...${colors.reset}`)

// Verificar middleware de seguridad
const middlewarePath = path.join(process.cwd(), "middleware.ts")
if (fs.existsSync(middlewarePath)) {
  console.log(`${colors.green}✓ Middleware de seguridad encontrado${colors.reset}`)
} else {
  console.log(`${colors.red}✗ No se encontró middleware de seguridad${colors.reset}`)
}

// Verificar control de acceso basado en roles
const authUtilsPath = path.join(process.cwd(), "lib/auth-utils.ts")
if (fs.existsSync(authUtilsPath)) {
  console.log(`${colors.green}✓ Control de acceso basado en roles encontrado${colors.reset}`)
} else {
  console.log(`${colors.red}✗ No se encontró control de acceso basado en roles${colors.reset}`)
}

// Verificar protección de rutas
const protectedRoutePath = path.join(process.cwd(), "components/auth/protected-route.tsx")
if (fs.existsSync(protectedRoutePath)) {
  console.log(`${colors.green}✓ Protección de rutas encontrada${colors.reset}`)
} else {
  console.log(`${colors.red}✗ No se encontró protección de rutas${colors.reset}`)
}

console.log(`\n${colors.blue}=== Verificación de seguridad completada ===${colors.reset}`)

/**
 * Script principal para ejecutar todas las pruebas
 */

import { spawn } from "child_process"
import path from "path"
import fs from "fs"

// Función para ejecutar un script de prueba
function runTest(testFile: string): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`\n\n========================================================`)
    console.log(`EJECUTANDO: ${testFile}`)
    console.log(`========================================================\n`)

    const testProcess = spawn("node", [path.join(__dirname, testFile)], {
      stdio: "inherit",
    })

    testProcess.on("close", (code) => {
      const success = code === 0
      console.log(
        `\n${success ? "✅" : "❌"} Test ${testFile} ${success ? "completado con éxito" : "falló"} (código: ${code})`,
      )
      resolve(success)
    })
  })
}

// Función principal para ejecutar todas las pruebas
async function runAllTests() {
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   SISTEMA DE PRUEBAS - APLICACIÓN UNIVERSITARIA      ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `)

  // Obtener todos los archivos de prueba
  const testFiles = fs.readdirSync(__dirname).filter((file) => file.endsWith("-test.js") && file !== "run-all-tests.js")

  console.log(`Se encontraron ${testFiles.length} pruebas para ejecutar:\n`)
  testFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`)
  })

  // Resultados de las pruebas
  const results: { file: string; success: boolean }[] = []

  // Ejecutar cada prueba secuencialmente
  for (const file of testFiles) {
    const success = await runTest(file)
    results.push({ file, success })
  }

  // Mostrar resumen de resultados
  console.log(`\n
  ╔═══════════════════════════════════════════════════════╗
  ║                 RESUMEN DE RESULTADOS                 ║
  ╚═══════════════════════════════════════════════════════╝
  `)

  results.forEach(({ file, success }) => {
    console.log(`${success ? "✅" : "❌"} ${file}`)
  })

  const successCount = results.filter((r) => r.success).length
  const failCount = results.length - successCount

  console.log(`\nResultado final: ${successCount} pruebas exitosas, ${failCount} pruebas fallidas`)

  if (failCount === 0) {
    console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║   ¡TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE!       ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
    `)
  } else {
    console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║   ATENCIÓN: ALGUNAS PRUEBAS HAN FALLADO              ║
    ║   Revise los detalles para solucionar los problemas  ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
    `)
  }
}

// Ejecutar todas las pruebas
runAllTests().catch(console.error)

/**
 * Prueba de rendimiento
 * Este script realiza pruebas básicas de rendimiento para operaciones críticas
 */

import { prisma } from "../lib/prisma"
import { getAllStudents, getAllProfessors, getAllSubjects } from "../lib/data-service"
import { generatePDF } from "../lib/report-service"

async function testPerformance() {
  console.log("🧪 INICIANDO PRUEBAS DE RENDIMIENTO")
  console.log("==================================")

  // Prueba 1: Medir tiempo de consulta de estudiantes
  console.log("Prueba 1: Medir tiempo de consulta de estudiantes")

  const startStudents = performance.now()
  const studentsResult = await getAllStudents()
  const endStudents = performance.now()

  const studentsTime = endStudents - startStudents
  console.log(`   Tiempo de consulta: ${studentsTime.toFixed(2)} ms`)
  console.log(`   Número de estudiantes: ${studentsResult.data?.length || 0}`)
  console.log(
    `   Rendimiento: ${studentsResult.success ? "✅ ACEPTABLE" : "❌ INACEPTABLE"} ${studentsTime > 1000 ? "(LENTO)" : ""}`,
  )

  // Prueba 2: Medir tiempo de consulta de profesores
  console.log("\nPrueba 2: Medir tiempo de consulta de profesores")

  const startProfessors = performance.now()
  const professorsResult = await getAllProfessors()
  const endProfessors = performance.now()

  const professorsTime = endProfessors - startProfessors
  console.log(`   Tiempo de consulta: ${professorsTime.toFixed(2)} ms`)
  console.log(`   Número de profesores: ${professorsResult.data?.length || 0}`)
  console.log(
    `   Rendimiento: ${professorsResult.success ? "✅ ACEPTABLE" : "❌ INACEPTABLE"} ${professorsTime > 1000 ? "(LENTO)" : ""}`,
  )

  // Prueba 3: Medir tiempo de consulta de materias
  console.log("\nPrueba 3: Medir tiempo de consulta de materias")

  const startSubjects = performance.now()
  const subjectsResult = await getAllSubjects()
  const endSubjects = performance.now()

  const subjectsTime = endSubjects - startSubjects
  console.log(`   Tiempo de consulta: ${subjectsTime.toFixed(2)} ms`)
  console.log(`   Número de materias: ${subjectsResult.data?.length || 0}`)
  console.log(
    `   Rendimiento: ${subjectsResult.success ? "✅ ACEPTABLE" : "❌ INACEPTABLE"} ${subjectsTime > 1000 ? "(LENTO)" : ""}`,
  )

  // Prueba 4: Medir tiempo de generación de PDF
  console.log("\nPrueba 4: Medir tiempo de generación de PDF")

  // Datos de prueba para el reporte
  const reportData = {
    title: "Reporte de Rendimiento",
    subtitle: "Prueba de Generación de PDF",
    date: new Date().toLocaleDateString(),
    columns: ["ID", "Nombre", "Email", "Rol"],
    data: Array(100)
      .fill(null)
      .map((_, i) => ({
        id: `${i + 1}`.padStart(3, "0"),
        nombre: `Usuario ${i + 1}`,
        email: `usuario${i + 1}@test.com`,
        rol: i % 3 === 0 ? "Estudiante" : i % 3 === 1 ? "Profesor" : "Administrador",
      })),
    footer: "Sistema de Gestión Universitaria - Prueba de Rendimiento",
  }

  const startPDF = performance.now()
  await generatePDF(reportData)
  const endPDF = performance.now()

  const pdfTime = endPDF - startPDF
  console.log(`   Tiempo de generación: ${pdfTime.toFixed(2)} ms`)
  console.log(
    `   Rendimiento: ${pdfTime < 3000 ? "✅ ACEPTABLE" : "❌ INACEPTABLE"} ${pdfTime > 5000 ? "(MUY LENTO)" : ""}`,
  )

  // Prueba 5: Medir tiempo de consultas complejas
  console.log("\nPrueba 5: Medir tiempo de consultas complejas")

  const startComplex = performance.now()

  // Consulta compleja: estudiantes con sus inscripciones, materias y calificaciones
  const complexResult = await prisma.student.findMany({
    take: 10,
    include: {
      user: true,
      career: true,
      enrollments: {
        include: {
          section: {
            include: {
              subject: true,
              professor: {
                include: {
                  user: true,
                },
              },
            },
          },
          grades: true,
        },
      },
    },
  })

  const endComplex = performance.now()

  const complexTime = endComplex - startComplex
  console.log(`   Tiempo de consulta compleja: ${complexTime.toFixed(2)} ms`)
  console.log(`   Número de estudiantes consultados: ${complexResult.length}`)
  console.log(
    `   Rendimiento: ${complexTime < 5000 ? "✅ ACEPTABLE" : "❌ INACEPTABLE"} ${complexTime > 10000 ? "(MUY LENTO)" : ""}`,
  )

  console.log("\n✅ PRUEBAS DE RENDIMIENTO COMPLETADAS")
}

// Ejecutar las pruebas
testPerformance().catch(console.error)

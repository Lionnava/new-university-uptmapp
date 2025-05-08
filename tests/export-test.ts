/**
 * Prueba de exportación de documentos
 * Este script verifica la funcionalidad de exportación en diferentes formatos
 */

import { generatePDF, generateExcel, generateDOC, generateDocument } from "../lib/report-service"

async function testExportFunctions() {
  console.log("🧪 INICIANDO PRUEBAS DE EXPORTACIÓN DE DOCUMENTOS")
  console.log("================================================")

  // Datos de prueba para reportes
  const reportData = {
    title: "Reporte de Prueba",
    subtitle: "Prueba de Exportación",
    date: new Date().toLocaleDateString(),
    columns: ["ID", "Nombre", "Email", "Rol"],
    data: [
      { id: "001", nombre: "Juan Pérez", email: "juan@test.com", rol: "Estudiante" },
      { id: "002", nombre: "María Gómez", email: "maria@test.com", rol: "Profesor" },
      { id: "003", nombre: "Carlos López", email: "carlos@test.com", rol: "Administrador" },
      { id: "004", nombre: "Ana Martínez", email: "ana@test.com", rol: "Estudiante" },
      { id: "005", nombre: "Luis Rodríguez", email: "luis@test.com", rol: "Profesor" },
    ],
    footer: "Sistema de Gestión Universitaria - Prueba",
  }

  // Datos de prueba para documentos
  const documentData = {
    title: "Constancia de Estudios",
    content:
      "Por medio de la presente se hace constar que el estudiante Juan Pérez, con cédula V-12345678, está inscrito en la carrera de Ingeniería Informática durante el período académico 2023-2024.",
    signature: "Dr. Roberto Sánchez\nDirector Académico",
    date: new Date().toLocaleDateString(),
    type: "constancia" as const,
    studentName: "Juan Pérez",
    studentId: "EST-001",
  }

  // Prueba 1: Exportar a PDF
  try {
    console.log("Prueba 1: Exportar reporte a PDF")
    console.log("   Generando PDF...")
    await generatePDF(reportData)
    console.log("✅ PDF generado correctamente")
  } catch (error) {
    console.error(`❌ Error al generar PDF: ${error}`)
  }

  // Prueba 2: Exportar a Excel
  try {
    console.log("\nPrueba 2: Exportar reporte a Excel")
    console.log("   Generando Excel...")
    await generateExcel(reportData)
    console.log("✅ Excel generado correctamente")
  } catch (error) {
    console.error(`❌ Error al generar Excel: ${error}`)
  }

  // Prueba 3: Exportar a DOC
  try {
    console.log("\nPrueba 3: Exportar reporte a DOC")
    console.log("   Generando DOC...")
    await generateDOC(reportData)
    console.log("✅ DOC generado correctamente")
  } catch (error) {
    console.error(`❌ Error al generar DOC: ${error}`)
  }

  // Prueba 4: Generar documento académico
  try {
    console.log("\nPrueba 4: Generar documento académico (constancia)")
    console.log("   Generando documento...")
    await generateDocument(documentData, "pdf")
    console.log("✅ Documento académico generado correctamente")
  } catch (error) {
    console.error(`❌ Error al generar documento académico: ${error}`)
  }

  console.log("\n✅ PRUEBAS DE EXPORTACIÓN COMPLETADAS")
}

// Ejecutar las pruebas
testExportFunctions().catch(console.error)

// Este archivo reemplaza la funcionalidad de xlsx con una alternativa más segura
import * as XLSX from "exceljs"

export async function generateExcel(reportData: {
  title: string
  columns: string[]
  data: any[]
}) {
  // Crear un nuevo libro de trabajo
  const workbook = new XLSX.Workbook()
  const worksheet = workbook.addWorksheet("Reporte")

  // Añadir título como una fila fusionada
  worksheet.addRow([reportData.title])
  worksheet.mergeCells("A1:" + String.fromCharCode(64 + reportData.columns.length) + "1")
  const titleRow = worksheet.getRow(1)
  titleRow.font = { bold: true, size: 16 }
  titleRow.alignment = { horizontal: "center" }

  // Añadir encabezados
  const headerRow = worksheet.addRow(reportData.columns)
  headerRow.font = { bold: true }
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4285F4" },
    }
    cell.font = { color: { argb: "FFFFFF" }, bold: true }
  })

  // Añadir datos
  reportData.data.forEach((row) => {
    const values = Object.values(row)
    worksheet.addRow(values)
  })

  // Ajustar ancho de columnas
  worksheet.columns.forEach((column) => {
    column.width = 15
  })

  // Generar el archivo
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

  // Descargar el archivo
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${reportData.title.replace(/\s+/g, "_")}.xlsx`
  link.click()
  URL.revokeObjectURL(link.href)
}

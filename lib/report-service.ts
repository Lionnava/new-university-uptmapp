import jsPDF from "jspdf"
import "jspdf-autotable"
import * as ExcelJS from "exceljs"
import { saveAs } from "file-saver"

// Tipos para los datos del reporte
export interface ReportData {
  title: string
  subtitle?: string
  date: string
  columns: string[]
  data: any[]
  footer?: string
}

// Función para generar un PDF
export async function generatePDF(data: ReportData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Crear un nuevo documento PDF
      const doc = new jsPDF()

      // Configurar el título
      doc.setFontSize(18)
      doc.text(data.title, 14, 20)

      // Configurar el subtítulo si existe
      if (data.subtitle) {
        doc.setFontSize(12)
        doc.text(data.subtitle, 14, 30)
      }

      // Configurar la fecha
      doc.setFontSize(10)
      doc.text(`Fecha: ${data.date}`, 14, data.subtitle ? 40 : 30)

      // Preparar los datos para la tabla
      const tableData = data.data.map((item) => {
        return Object.values(item)
      })

      // Generar la tabla
      doc.autoTable({
        head: [data.columns],
        body: tableData,
        startY: data.subtitle ? 45 : 35,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      })

      // Agregar pie de página si existe
      if (data.footer) {
        const pageCount = doc.internal.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.setFontSize(8)
          doc.text(data.footer, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: "center" })
        }
      }

      // Guardar el PDF
      doc.save(`${data.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`)

      resolve()
    } catch (error) {
      console.error("Error al generar PDF:", error)
      reject(error)
    }
  })
}

// Función para generar un Excel
export async function generateExcel(data: ReportData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()
      workbook.creator = "Sistema de Gestión Universitaria"
      workbook.lastModifiedBy = "Sistema de Gestión Universitaria"
      workbook.created = new Date()
      workbook.modified = new Date()

      // Crear una hoja de trabajo
      const worksheet = workbook.addWorksheet(data.title)

      // Configurar el título
      worksheet.mergeCells("A1:E1")
      const titleCell = worksheet.getCell("A1")
      titleCell.value = data.title
      titleCell.font = {
        size: 16,
        bold: true,
      }
      titleCell.alignment = { horizontal: "center" }

      // Configurar el subtítulo si existe
      if (data.subtitle) {
        worksheet.mergeCells("A2:E2")
        const subtitleCell = worksheet.getCell("A2")
        subtitleCell.value = data.subtitle
        subtitleCell.font = {
          size: 12,
        }
        subtitleCell.alignment = { horizontal: "center" }
      }

      // Configurar la fecha
      worksheet.mergeCells("A3:E3")
      const dateCell = worksheet.getCell("A3")
      dateCell.value = `Fecha: ${data.date}`
      dateCell.font = {
        size: 10,
      }
      dateCell.alignment = { horizontal: "left" }

      // Agregar encabezados de columna
      const headerRow = worksheet.addRow(data.columns)
      headerRow.font = {
        bold: true,
      }
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4F81BD" },
        }
        cell.font = {
          bold: true,
          color: { argb: "FFFFFF" },
        }
      })

      // Agregar datos
      data.data.forEach((item) => {
        const row = worksheet.addRow(Object.values(item))
      })

      // Ajustar el ancho de las columnas
      worksheet.columns.forEach((column) => {
        column.width = 20
      })

      // Agregar pie de página si existe
      if (data.footer) {
        const footerRow = worksheet.addRow([])
        const footerCell = worksheet.mergeCells(`A${worksheet.rowCount}:E${worksheet.rowCount}`)
        worksheet.getCell(`A${worksheet.rowCount}`).value = data.footer
        worksheet.getCell(`A${worksheet.rowCount}`).font = {
          size: 8,
        }
        worksheet.getCell(`A${worksheet.rowCount}`).alignment = { horizontal: "center" }
      }

      // Guardar el archivo Excel
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
        saveAs(blob, `${data.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`)
        resolve()
      })
    } catch (error) {
      console.error("Error al generar Excel:", error)
      reject(error)
    }
  })
}

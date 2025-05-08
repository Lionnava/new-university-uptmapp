"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { generatePDF, generateExcel } from "@/lib/report-service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, FileSpreadsheet, Download, Eye } from "lucide-react"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("reportes")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState({
    title: "",
    type: "",
    format: "pdf",
  })
  const [isLoading, setIsLoading] = useState({
    pdf: false,
    excel: false,
  })
  const { toast } = useToast()

  const handlePreview = (title: string, type: string, format = "pdf") => {
    setPreviewData({ title, type, format })
    setPreviewOpen(true)

    toast({
      title: "Vista previa generada",
      description: `Vista previa de ${title} generada correctamente.`,
    })
  }

  const handleExport = async (title: string, type: string, format: string) => {
    try {
      // Establecer estado de carga
      setIsLoading({ ...isLoading, [format]: true })

      // Generar datos de ejemplo para el reporte
      const today = new Date().toLocaleDateString()
      let reportData

      switch (type) {
        case "all":
          reportData = {
            title: "Listado de Estudiantes",
            subtitle: "Período: 2023 - Trimestre III",
            date: today,
            columns: ["ID", "Nombre", "Cédula", "Carrera", "Estado"],
            data: [
              {
                id: "EST-001",
                nombre: "Ana María Rodríguez",
                cedula: "V-25.789.456",
                carrera: "Ingeniería Informática",
                estado: "Activo",
              },
              {
                id: "EST-002",
                nombre: "Carlos Eduardo Pérez",
                cedula: "V-26.123.789",
                carrera: "Administración",
                estado: "Activo",
              },
              {
                id: "EST-003",
                nombre: "María Fernanda López",
                cedula: "V-24.567.890",
                carrera: "Contaduría",
                estado: "Inactivo",
              },
              {
                id: "EST-004",
                nombre: "José Luis Martínez",
                cedula: "V-27.890.123",
                carrera: "Ingeniería Industrial",
                estado: "Activo",
              },
              {
                id: "EST-005",
                nombre: "Luisa Alejandra Torres",
                cedula: "V-25.456.789",
                carrera: "Ingeniería Informática",
                estado: "Egresado",
              },
            ],
            footer: "Sistema de Gestión Universitaria © " + new Date().getFullYear(),
          }
          break
        case "subject":
          reportData = {
            title: "Acta de Notas",
            subtitle: "Materia: Introducción a la Programación (INF-101) - Sección: SEC-001",
            date: today,
            columns: ["ID", "Nombre", "Cédula", "Eval 1 (20%)", "Eval 2 (30%)", "Eval 3 (50%)", "Final"],
            data: [
              {
                id: "EST-001",
                nombre: "Ana María Rodríguez",
                cedula: "V-25.789.456",
                eval1: 18,
                eval2: 17,
                eval3: 19,
                final: 18.2,
              },
              {
                id: "EST-002",
                nombre: "Carlos Eduardo Pérez",
                cedula: "V-26.123.789",
                eval1: 15,
                eval2: 16,
                eval3: 14,
                final: 14.9,
              },
              {
                id: "EST-003",
                nombre: "María Fernanda López",
                cedula: "V-24.567.890",
                eval1: 12,
                eval2: 14,
                eval3: 15,
                final: 14.1,
              },
              {
                id: "EST-004",
                nombre: "José Luis Martínez",
                cedula: "V-27.890.123",
                eval1: 16,
                eval2: 15,
                eval3: 17,
                final: 16.1,
              },
              {
                id: "EST-005",
                nombre: "Luisa Alejandra Torres",
                cedula: "V-25.456.789",
                eval1: 19,
                eval2: 18,
                eval3: 20,
                final: 19.2,
              },
            ],
            footer: "Sistema de Gestión Universitaria © " + new Date().getFullYear(),
          }
          break
        default:
          reportData = {
            title,
            date: today,
            columns: ["ID", "Nombre", "Valor"],
            data: [
              { id: 1, nombre: "Ejemplo 1", valor: "Valor 1" },
              { id: 2, nombre: "Ejemplo 2", valor: "Valor 2" },
              { id: 3, nombre: "Ejemplo 3", valor: "Valor 3" },
            ],
            footer: "Sistema de Gestión Universitaria © " + new Date().getFullYear(),
          }
      }

      // Simular un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Exportar según el formato
      switch (format) {
        case "pdf":
          await generatePDF(reportData)
          break
        case "excel":
          await generateExcel(reportData)
          break
        default:
          await generatePDF(reportData)
      }

      toast({
        title: "Exportación exitosa",
        description: `El reporte ha sido exportado en formato ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error("Error al exportar:", error)
      toast({
        variant: "destructive",
        title: "Error de exportación",
        description: "No se pudo exportar el reporte. Intente nuevamente más tarde.",
      })
    } finally {
      // Restablecer estado de carga
      setIsLoading({ ...isLoading, [format]: false })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Módulo de Reportes y Documentos</h1>

      <Tabs defaultValue="reportes" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="reportes">Reportes Académicos</TabsTrigger>
          <TabsTrigger value="documentos">Documentos Oficiales</TabsTrigger>
        </TabsList>

        <TabsContent value="reportes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Reporte de Estudiantes */}
            <Card>
              <CardHeader>
                <CardTitle>Listado de Estudiantes</CardTitle>
                <CardDescription>
                  Genera un reporte completo de todos los estudiantes registrados en el sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleExport("Listado de Estudiantes", "all", "pdf")}
                    disabled={isLoading.pdf}
                    className="flex items-center gap-2"
                  >
                    {isLoading.pdf ? (
                      <>Generando...</>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        PDF
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleExport("Listado de Estudiantes", "all", "excel")}
                    disabled={isLoading.excel}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    {isLoading.excel ? (
                      <>Generando...</>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handlePreview("Listado de Estudiantes", "all")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Vista previa
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Acta de Notas */}
            <Card>
              <CardHeader>
                <CardTitle>Acta de Notas</CardTitle>
                <CardDescription>Genera un acta de notas para una materia y sección específica.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleExport("Acta de Notas", "subject", "pdf")}
                    disabled={isLoading.pdf}
                    className="flex items-center gap-2"
                  >
                    {isLoading.pdf ? (
                      <>Generando...</>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        PDF
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleExport("Acta de Notas", "subject", "excel")}
                    disabled={isLoading.excel}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    {isLoading.excel ? (
                      <>Generando...</>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handlePreview("Acta de Notas", "subject")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Vista previa
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Récord Académico */}
            <Card>
              <CardHeader>
                <CardTitle>Récord Académico</CardTitle>
                <CardDescription>Genera un récord académico completo para un estudiante.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleExport("Récord Académico", "record", "pdf")}
                    disabled={isLoading.pdf}
                    className="flex items-center gap-2"
                  >
                    {isLoading.pdf ? (
                      <>Generando...</>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        PDF
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleExport("Récord Académico", "record", "excel")}
                    disabled={isLoading.excel}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    {isLoading.excel ? (
                      <>Generando...</>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documentos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Constancia de Estudios */}
            <Card>
              <CardHeader>
                <CardTitle>Constancia de Estudios</CardTitle>
                <CardDescription>Genera una constancia de estudios para un estudiante específico.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleExport("Constancia de Estudios", "certificate", "pdf")}
                    disabled={isLoading.pdf}
                    className="flex items-center gap-2"
                  >
                    {isLoading.pdf ? (
                      <>Generando...</>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Generar
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handlePreview("Constancia de Estudios", "certificate")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Vista previa
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Horario de Clases */}
            <Card>
              <CardHeader>
                <CardTitle>Horario de Clases</CardTitle>
                <CardDescription>Genera un horario de clases para una sección o profesor.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleExport("Horario de Clases", "schedule", "pdf")}
                    disabled={isLoading.pdf}
                    className="flex items-center gap-2"
                  >
                    {isLoading.pdf ? (
                      <>Generando...</>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        PDF
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleExport("Horario de Clases", "schedule", "excel")}
                    disabled={isLoading.excel}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    {isLoading.excel ? (
                      <>Generando...</>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Carta de Recomendación */}
            <Card>
              <CardHeader>
                <CardTitle>Carta de Recomendación</CardTitle>
                <CardDescription>Genera una carta de recomendación para un estudiante.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleExport("Carta de Recomendación", "recommendation", "pdf")}
                    disabled={isLoading.pdf}
                    className="flex items-center gap-2"
                  >
                    {isLoading.pdf ? (
                      <>Generando...</>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Generar
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handlePreview("Carta de Recomendación", "recommendation")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Vista previa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  FileDown,
  Printer,
  Save,
  FileText,
  FilePlus,
  FileUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateDocument, printReport } from "@/lib/report-service"

export function DocumentEditor() {
  const [documentType, setDocumentType] = useState("constancia")
  const [documentTitle, setDocumentTitle] = useState("Constancia de Estudios")
  const [selectedTemplate, setSelectedTemplate] = useState("default")
  const [isExporting, setIsExporting] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Función para exportar el documento
  const handleExport = async (format: "pdf" | "doc") => {
    try {
      setIsExporting(true)

      // Obtener el contenido del editor
      const editorContent = editorRef.current?.querySelector('[contenteditable="true"]')?.textContent || ""

      // Generar el documento
      await generateDocument(
        {
          title: documentTitle,
          content: editorContent,
          date: new Date().toLocaleDateString(),
          type: documentType as any,
          signature: "Director de Control de Estudios\nUniversidad Nacional",
          studentName: "NOMBRE DEL ESTUDIANTE",
          studentId: "V-00.000.000",
        },
        format,
      )

      toast({
        title: "Exportación exitosa",
        description: `El documento ha sido exportado en formato ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error("Error al exportar:", error)
      toast({
        variant: "destructive",
        title: "Error de exportación",
        description: "No se pudo exportar el documento. Intente nuevamente.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Función para imprimir el documento
  const handlePrint = () => {
    try {
      setIsPrinting(true)
      printReport("document-editor-content")
      toast({
        title: "Impresión iniciada",
        description: "El documento se está enviando a la impresora.",
      })
    } catch (error) {
      console.error("Error al imprimir:", error)
      toast({
        variant: "destructive",
        title: "Error de impresión",
        description: "No se pudo imprimir el documento. Intente nuevamente.",
      })
    } finally {
      setIsPrinting(false)
    }
  }

  // Función para guardar el documento
  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Simular guardado en el servidor
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Documento guardado",
        description: "El documento ha sido guardado correctamente.",
      })
    } catch (error) {
      console.error("Error al guardar:", error)
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "No se pudo guardar el documento. Intente nuevamente.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Función para crear un nuevo documento
  const handleNew = () => {
    if (editorRef.current) {
      const editorContent = editorRef.current.querySelector('[contenteditable="true"]')
      if (editorContent) {
        editorContent.textContent = "Escriba aquí el contenido de su documento..."
      }
    }

    setDocumentTitle("Nuevo Documento")
    setDocumentType("custom")

    toast({
      title: "Nuevo documento",
      description: "Se ha creado un nuevo documento.",
    })
  }

  // Función para importar un documento
  const handleImport = () => {
    // Simular importación de un documento
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".txt,.doc,.docx,.pdf"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        toast({
          title: "Documento importado",
          description: `Se ha importado el documento: ${file.name}`,
        })
      }
    }
    input.click()
  }

  // Función para aplicar formato al texto
  const applyFormat = (command: string, value = "") => {
    document.execCommand(command, false, value)
  }

  return (
    <div className="space-y-6" ref={editorRef}>
      <Card>
        <CardHeader>
          <CardTitle>Editor de Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Tipo de Documento</label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="constancia">Constancia de Estudios</SelectItem>
                  <SelectItem value="notas">Constancia de Notas</SelectItem>
                  <SelectItem value="recomendacion">Carta de Recomendación</SelectItem>
                  <SelectItem value="custom">Documento Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Plantilla</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar plantilla" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Plantilla Estándar</SelectItem>
                  <SelectItem value="formal">Formal con Logo</SelectItem>
                  <SelectItem value="simple">Minimalista</SelectItem>
                  <SelectItem value="academic">Académica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Título del Documento</label>
              <Input
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Ingrese el título del documento"
              />
            </div>
          </div>

          <div className="border rounded-md p-2 mb-4">
            <div className="flex items-center space-x-1 border-b pb-2 mb-2">
              <Button variant="ghost" size="sm" onClick={() => applyFormat("bold")}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => applyFormat("italic")}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => applyFormat("underline")}>
                <Underline className="h-4 w-4" />
              </Button>
              <div className="h-4 border-r mx-2"></div>
              <Button variant="ghost" size="sm" onClick={() => applyFormat("justifyLeft")}>
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => applyFormat("justifyCenter")}>
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => applyFormat("justifyRight")}>
                <AlignRight className="h-4 w-4" />
              </Button>
              <div className="h-4 border-r mx-2"></div>
              <Button variant="ghost" size="sm" onClick={() => applyFormat("insertUnorderedList")}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => applyFormat("insertOrderedList")}>
                <ListOrdered className="h-4 w-4" />
              </Button>
              <div className="h-4 border-r mx-2"></div>
              <Select defaultValue="arial" onValueChange={(value) => applyFormat("fontName", value)}>
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue placeholder="Fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arial">Arial</SelectItem>
                  <SelectItem value="times new roman">Times New Roman</SelectItem>
                  <SelectItem value="calibri">Calibri</SelectItem>
                  <SelectItem value="courier new">Courier New</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="12" onValueChange={(value) => applyFormat("fontSize", value)}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder="Tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">10</SelectItem>
                  <SelectItem value="2">11</SelectItem>
                  <SelectItem value="3">12</SelectItem>
                  <SelectItem value="4">14</SelectItem>
                  <SelectItem value="5">16</SelectItem>
                  <SelectItem value="6">18</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div id="document-editor-content" className="min-h-[500px] p-4 border rounded-md bg-white" contentEditable>
              {documentType === "constancia" && (
                <>
                  <div className="text-center mb-6">
                    <h1 className="text-xl font-bold uppercase">CONSTANCIA DE ESTUDIOS</h1>
                    <p className="text-sm">Universidad Nacional</p>
                  </div>

                  <p className="mb-4">
                    Quien suscribe, Director de Control de Estudios de la Universidad Nacional, hace constar por medio
                    de la presente que:
                  </p>

                  <p className="text-center font-bold mb-4">NOMBRE DEL ESTUDIANTE</p>

                  <p className="mb-4">
                    Titular de la Cédula de Identidad N° V-00.000.000, es estudiante regular de esta Casa de Estudios,
                    cursando actualmente el 5to semestre de la carrera de INGENIERÍA INFORMÁTICA.
                  </p>

                  <p className="mb-4">
                    Constancia que se expide a petición de la parte interesada en la Ciudad Universitaria, a los{" "}
                    {new Date().getDate()} días del mes de {new Date().toLocaleString("es-ES", { month: "long" })} de{" "}
                    {new Date().getFullYear()}.
                  </p>

                  <div className="mt-16 text-center">
                    <p className="border-t border-black pt-2 inline-block">
                      Director de Control de Estudios
                      <br />
                      Universidad Nacional
                    </p>
                  </div>
                </>
              )}

              {documentType === "notas" && (
                <>
                  <div className="text-center mb-6">
                    <h1 className="text-xl font-bold uppercase">CONSTANCIA DE NOTAS</h1>
                    <p className="text-sm">Universidad Nacional</p>
                  </div>

                  <p className="mb-4">
                    Por medio de la presente se certifica que el estudiante NOMBRE DEL ESTUDIANTE, titular de la Cédula
                    de Identidad N° V-00.000.000, ha obtenido las siguientes calificaciones en el período académico
                    2023-III:
                  </p>

                  <table className="w-full border-collapse mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Código</th>
                        <th className="border p-2 text-left">Asignatura</th>
                        <th className="border p-2 text-center">Créditos</th>
                        <th className="border p-2 text-center">Calificación</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2">INF-101</td>
                        <td className="border p-2">Introducción a la Programación</td>
                        <td className="border p-2 text-center">4</td>
                        <td className="border p-2 text-center">18</td>
                      </tr>
                      <tr>
                        <td className="border p-2">MAT-201</td>
                        <td className="border p-2">Cálculo I</td>
                        <td className="border p-2 text-center">4</td>
                        <td className="border p-2 text-center">16</td>
                      </tr>
                      <tr>
                        <td className="border p-2">FIS-101</td>
                        <td className="border p-2">Física I</td>
                        <td className="border p-2 text-center">4</td>
                        <td className="border p-2 text-center">17</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="mb-4">
                    Promedio del período: <strong>17.00</strong> puntos.
                  </p>

                  <p className="mb-4">
                    Constancia que se expide a petición de la parte interesada en la Ciudad Universitaria, a los{" "}
                    {new Date().getDate()} días del mes de {new Date().toLocaleString("es-ES", { month: "long" })} de{" "}
                    {new Date().getFullYear()}.
                  </p>

                  <div className="mt-16 text-center">
                    <p className="border-t border-black pt-2 inline-block">
                      Director de Control de Estudios
                      <br />
                      Universidad Nacional
                    </p>
                  </div>
                </>
              )}

              {documentType === "custom" && <p>Escriba aquí el contenido de su documento...</p>}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="space-x-2">
              <Button variant="outline" onClick={handleNew}>
                <FilePlus className="mr-2 h-4 w-4" />
                Nuevo
              </Button>
              <Button variant="outline" onClick={handleImport}>
                <FileUp className="mr-2 h-4 w-4" />
                Importar
              </Button>
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
                <Printer className="mr-2 h-4 w-4" />
                {isPrinting ? "Imprimiendo..." : "Imprimir"}
              </Button>
              <Button variant="outline" onClick={() => handleExport("pdf")} disabled={isExporting}>
                <FileDown className="mr-2 h-4 w-4" />
                {isExporting ? "Exportando..." : "Exportar PDF"}
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: "Constancia de Estudios - Ana Rodríguez", date: "12/11/2023", type: "constancia" },
              { name: "Constancia de Notas - Carlos Pérez", date: "10/11/2023", type: "notas" },
              { name: "Carta de Recomendación - María López", date: "05/11/2023", type: "recomendacion" },
              { name: "Solicitud de Equivalencia", date: "01/11/2023", type: "custom" },
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-gray-500">Modificado: {doc.date}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDocumentType(doc.type)
                    setDocumentTitle(doc.name.split(" - ")[0])
                    toast({
                      title: "Documento abierto",
                      description: `Se ha abierto el documento: ${doc.name}`,
                    })
                  }}
                >
                  Abrir
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

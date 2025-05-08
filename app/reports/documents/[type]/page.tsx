"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, FileDown, Printer, Save, Eye } from "lucide-react"

export default function DocumentPage({ params }: { params: { type: string } }) {
  const [documentTitle, setDocumentTitle] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [studentId, setStudentId] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    // Set document title and type based on the URL parameter
    switch (params.type) {
      case "certificate":
        setDocumentTitle("Constancia de Estudios")
        setDocumentType("constancia")
        break
      case "grades":
        setDocumentTitle("Constancia de Notas")
        setDocumentType("notas")
        break
      case "recommendation":
        setDocumentTitle("Carta de Recomendación")
        setDocumentType("recomendacion")
        break
      case "graduation":
        setDocumentTitle("Constancia de Culminación")
        setDocumentType("culminacion")
        break
      case "schedule":
        setDocumentTitle("Carga Académica")
        setDocumentType("carga")
        break
      case "transfer":
        setDocumentTitle("Solicitud de Equivalencia")
        setDocumentType("equivalencia")
        break
      default:
        setDocumentTitle("Documento")
        setDocumentType("custom")
    }
  }, [params.type])

  const getDocumentTypeLabel = () => {
    switch (params.type) {
      case "certificate":
        return "Constancia de Estudios"
      case "grades":
        return "Constancia de Notas"
      case "recommendation":
        return "Carta de Recomendación"
      case "graduation":
        return "Constancia de Culminación"
      case "schedule":
        return "Carga Académica"
      case "transfer":
        return "Solicitud de Equivalencia"
      default:
        return "Documento"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-700 text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Link href="/reports">
              <Button variant="ghost" className="text-white p-0 mr-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Generar {getDocumentTypeLabel()}</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="student">Datos del Estudiante</TabsTrigger>
            <TabsTrigger value="document">Contenido del Documento</TabsTrigger>
            <TabsTrigger value="preview">Vista Previa</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>Información del Estudiante</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Buscar Estudiante</label>
                      <div className="flex space-x-2">
                        <Input placeholder="Ingrese cédula o nombre" className="flex-1" />
                        <Button>Buscar</Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Estudiante Seleccionado</label>
                      <Select onValueChange={setStudentId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estudiante" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EST-001">Ana María Rodríguez (V-25.789.456)</SelectItem>
                          <SelectItem value="EST-002">Carlos Eduardo Pérez (V-26.123.789)</SelectItem>
                          <SelectItem value="EST-003">María Fernanda López (V-24.567.890)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {studentId && (
                    <div className="border rounded-md p-4 mt-4">
                      <h3 className="font-medium mb-2">Datos del Estudiante</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Nombre completo</p>
                          <p className="font-medium">Ana María Rodríguez</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Cédula</p>
                          <p className="font-medium">V-25.789.456</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Carrera</p>
                          <p className="font-medium">Ingeniería Informática</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Semestre actual</p>
                          <p className="font-medium">5to semestre</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Estado</p>
                          <p className="font-medium">Activo</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Índice académico</p>
                          <p className="font-medium">17.85</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button>Continuar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="document">
            <Card>
              <CardHeader>
                <CardTitle>Contenido del Documento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <SelectItem value="culminacion">Constancia de Culminación</SelectItem>
                          <SelectItem value="carga">Carga Académica</SelectItem>
                          <SelectItem value="equivalencia">Solicitud de Equivalencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Plantilla</label>
                      <Select defaultValue="default">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar plantilla" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Plantilla Estándar</SelectItem>
                          <SelectItem value="formal">Formal con Logo</SelectItem>
                          <SelectItem value="simple">Minimalista</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Título del Documento</label>
                    <Input
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Ingrese el título del documento"
                    />
                  </div>

                  {documentType === "constancia" && (
                    <div>
                      <label className="text-sm font-medium">Propósito de la Constancia</label>
                      <Select defaultValue="general">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar propósito" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Propósito General</SelectItem>
                          <SelectItem value="trabajo">Fines Laborales</SelectItem>
                          <SelectItem value="beca">Solicitud de Beca</SelectItem>
                          <SelectItem value="visa">Trámite de Visa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {documentType === "notas" && (
                    <div>
                      <label className="text-sm font-medium">Período Académico</label>
                      <Select defaultValue="2023-3">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los períodos</SelectItem>
                          <SelectItem value="2023-1">2023 - Trimestre I</SelectItem>
                          <SelectItem value="2023-2">2023 - Trimestre II</SelectItem>
                          <SelectItem value="2023-3">2023 - Trimestre III</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium">Observaciones Adicionales</label>
                    <Input placeholder="Ingrese observaciones adicionales (opcional)" />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowPreview(true)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Vista Previa
                    </Button>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Vista Previa del Documento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-8 bg-white min-h-[600px] mb-4">
                  {documentType === "constancia" && (
                    <>
                      <div className="text-center mb-6">
                        <h1 className="text-xl font-bold uppercase">{documentTitle}</h1>
                        <p className="text-sm">Universidad Nacional</p>
                      </div>

                      <p className="mb-4">
                        Quien suscribe, Director de Control de Estudios de la Universidad Nacional, hace constar por
                        medio de la presente que:
                      </p>

                      <p className="text-center font-bold mb-4">ANA MARÍA RODRÍGUEZ</p>

                      <p className="mb-4">
                        Titular de la Cédula de Identidad N° V-25.789.456, es estudiante regular de esta Casa de
                        Estudios, cursando actualmente el 5to semestre de la carrera de INGENIERÍA INFORMÁTICA.
                      </p>

                      <p className="mb-4">
                        Constancia que se expide a petición de la parte interesada en la Ciudad Universitaria, a los{" "}
                        {new Date().getDate()} días del mes de {new Date().toLocaleString("es-ES", { month: "long" })}{" "}
                        de {new Date().getFullYear()}.
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
                        <h1 className="text-xl font-bold uppercase">{documentTitle}</h1>
                        <p className="text-sm">Universidad Nacional</p>
                      </div>

                      <p className="mb-4">
                        Por medio de la presente se certifica que el estudiante ANA MARÍA RODRÍGUEZ, titular de la
                        Cédula de Identidad N° V-25.789.456, ha obtenido las siguientes calificaciones en el período
                        académico 2023-III:
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
                        {new Date().getDate()} días del mes de {new Date().toLocaleString("es-ES", { month: "long" })}{" "}
                        de {new Date().getFullYear()}.
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
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar como PDF
                  </Button>
                  <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar como DOC
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-gray-100 p-4">
        <div className="container mx-auto text-center text-sm text-gray-600">
          Sistema de Gestión Universitaria © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}

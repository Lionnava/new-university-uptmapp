"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Upload, Save, FileDown } from "lucide-react"
import { ProfessorForm } from "@/components/teachers/professor-form"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "exceljs"

const initialGradesData = [
  { id: "1", name: "Juan Perez", cedula: "123456789", grades: [15, 18, 20] },
  { id: "2", name: "Maria Rodriguez", cedula: "987654321", grades: [12, 16, 19] },
  { id: "3", name: "Carlos Gomez", cedula: "456789123", grades: [10, 14, 17] },
  { id: "4", name: "Ana Martinez", cedula: "321654987", grades: [18, 20, 15] },
  { id: "5", name: "Luis Gonzalez", cedula: "654987321", grades: [14, 17, 12] },
  { id: "6", name: "Sofia Diaz", cedula: "789123456", grades: [16, 19, 10] },
  { id: "7", name: "Pedro Ramirez", cedula: "234567891", grades: [20, 15, 18] },
  { id: "8", name: "Laura Castro", cedula: "876543219", grades: [17, 12, 16] },
  { id: "9", name: "Diego Silva", cedula: "567891234", grades: [19, 10, 14] },
  { id: "10", name: "Valeria Torres", cedula: "432198765", grades: [15, 18, 20] },
]

export default function TeachersPage() {
  const [activeTab, setActiveTab] = useState("evaluacion")
  const [isProfessorFormOpen, setIsProfessorFormOpen] = useState(false)
  const [selectedProfessor, setSelectedProfessor] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState("inf101-sec001")
  const [selectedPeriod, setSelectedPeriod] = useState("2024-1")
  const [gradesData, setGradesData] = useState(initialGradesData)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  function handleNewProfessor(values: any) {
    console.log("Nuevo profesor:", values)
    toast({
      title: "Profesor registrado",
      description: "El profesor ha sido registrado correctamente.",
    })
  }

  function handleGradeChange(studentId: string, evalIndex: number, value: string) {
    // Validar que el valor sea un número entre 0 y 20
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue) || numValue < 0 || numValue > 20) {
      return
    }

    // Actualizar las calificaciones
    const updatedGrades = gradesData.map((student) => {
      if (student.id === studentId) {
        const newGrades = [...student.grades]
        newGrades[evalIndex] = numValue
        return {
          ...student,
          grades: newGrades,
        }
      }
      return student
    })

    setGradesData(updatedGrades)
  }

  function handleSaveGrades() {
    setIsLoading(true)

    // Simular una operación asíncrona
    setTimeout(() => {
      toast({
        title: "Calificaciones guardadas",
        description: "Las calificaciones han sido guardadas correctamente.",
      })
      setIsLoading(false)
    }, 1000)
  }

  function handleImportGrades() {
    // Crear un input de tipo file invisible
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".xlsx,.xls"

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setIsLoading(true)

      try {
        // Leer el archivo Excel
        const workbook = new XLSX.Workbook()
        const arrayBuffer = await file.arrayBuffer()
        await workbook.xlsx.load(arrayBuffer)

        const worksheet = workbook.getWorksheet(1)
        if (!worksheet) throw new Error("No se encontró la hoja de cálculo")

        // Procesar los datos (esto es un ejemplo simplificado)
        const importedGrades = [...gradesData]

        // Suponiendo que el archivo tiene el formato: ID, Nombre, Eval1, Eval2, Eval3
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            // Ignorar encabezados
            const studentId = row.getCell(1).text
            const eval1 = Number.parseFloat(row.getCell(3).text) || 0
            const eval2 = Number.parseFloat(row.getCell(4).text) || 0
            const eval3 = Number.parseFloat(row.getCell(5).text) || 0

            // Actualizar las calificaciones del estudiante
            const studentIndex = importedGrades.findIndex((s) => s.id === studentId)
            if (studentIndex >= 0) {
              importedGrades[studentIndex].grades = [eval1, eval2, eval3]
            }
          }
        })

        setGradesData(importedGrades)

        toast({
          title: "Calificaciones importadas",
          description: "Las calificaciones han sido importadas correctamente.",
        })
      } catch (error) {
        console.error("Error al importar calificaciones:", error)
        toast({
          variant: "destructive",
          title: "Error al importar",
          description: "No se pudieron importar las calificaciones. Verifique el formato del archivo.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    input.click()
  }

  function handleExportGrades(format: string) {
    toast({
      title: `Exportación a ${format.toUpperCase()}`,
      description: `Las calificaciones han sido exportadas en formato ${format.toUpperCase()}.`,
    })
  }

  function handleSavePlanification() {
    setIsLoading(true)

    // Simular una operación asíncrona
    setTimeout(() => {
      toast({
        title: "Planificación guardada",
        description: "La planificación ha sido guardada correctamente.",
      })
      setIsLoading(false)
    }, 1000)
  }

  function handleAddResource() {
    toast({
      title: "Recurso añadido",
      description: "El recurso ha sido añadido correctamente.",
    })
  }

  // Función para calcular la nota final
  function calculateFinalGrade(grades) {
    const weights = [0.2, 0.3, 0.5]
    let finalGrade = 0

    for (let i = 0; i < grades.length; i++) {
      finalGrade += grades[i] * weights[i]
    }

    return finalGrade.toFixed(2)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-customBlue-700 text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" className="text-white p-0 mr-2">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Portal Docente</h1>
            </div>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-customBlue-600"
              onClick={() => setIsProfessorFormOpen(true)}
            >
              Registrar Profesor
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <Tabs defaultValue="evaluacion" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="evaluacion">Sistema de Evaluación</TabsTrigger>
            <TabsTrigger value="planificacion">Planificación de Clases</TabsTrigger>
          </TabsList>

          <TabsContent value="evaluacion">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestión de Evaluaciones</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="text-customBlue-700 border-customBlue-700 hover:bg-customBlue-50"
                    onClick={() => handleExportGrades("pdf")}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="text-customBlue-700 border-customBlue-700 hover:bg-customBlue-50"
                    onClick={() => handleExportGrades("excel")}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="Seleccionar materia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inf101-sec001">INF-101 - Introducción a la Programación (SEC-001)</SelectItem>
                      <SelectItem value="inf202-sec005">INF-202 - Estructura de Datos (SEC-005)</SelectItem>
                      <SelectItem value="mat201-sec002">MAT-201 - Cálculo I (SEC-002)</SelectItem>
                      <SelectItem value="adm301-sec003">ADM-301 - Administración de Empresas (SEC-003)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-1">2024 - Trimestre I</SelectItem>
                      <SelectItem value="2024-2">2024 - Trimestre II</SelectItem>
                      <SelectItem value="2024-3">2024 - Trimestre III</SelectItem>
                      <SelectItem value="2025-1">2025 - Trimestre I</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border mb-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Cédula</TableHead>
                        <TableHead>Evaluación 1 (20%)</TableHead>
                        <TableHead>Evaluación 2 (30%)</TableHead>
                        <TableHead>Evaluación 3 (50%)</TableHead>
                        <TableHead>Nota Final</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gradesData.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.cedula}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              defaultValue={student.grades[0].toString()}
                              onChange={(e) => handleGradeChange(student.id, 0, e.target.value)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              defaultValue={student.grades[1].toString()}
                              onChange={(e) => handleGradeChange(student.id, 1, e.target.value)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              defaultValue={student.grades[2].toString()}
                              onChange={(e) => handleGradeChange(student.id, 2, e.target.value)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>{calculateFinalGrade(student.grades)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="secondary"
                    className="bg-customBlue-500 text-white hover:bg-customBlue-700"
                    onClick={handleImportGrades}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Importar
                  </Button>
                  <Button disabled={isLoading} onClick={handleSaveGrades}>
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planificacion">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Planificación de Clases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="subject">Materia</Label>
                    <Input
                      id="subject"
                      defaultValue="Introducción a la Programación"
                      className="bg-gray-100"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="topic">Tema</Label>
                    <Input id="topic" placeholder="Ej. Introducción a la programación" />
                  </div>
                  <div>
                    <Label htmlFor="objective">Objetivo</Label>
                    <Textarea id="objective" placeholder="Ej. Comprender los conceptos básicos de la programación." />
                  </div>
                  <div>
                    <Label htmlFor="resources">Recursos</Label>
                    <Textarea id="resources" placeholder="Ej. Pizarra, proyector, computadora." />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-2 bg-customBlue-500 text-white hover:bg-customBlue-700"
                      onClick={handleAddResource}
                    >
                      Añadir Recurso
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor="activities">Actividades</Label>
                    <Textarea id="activities" placeholder="Ej. Explicación teórica, ejercicios prácticos." />
                  </div>
                  <div>
                    <Label htmlFor="evaluation">Evaluación</Label>
                    <Textarea id="evaluation" placeholder="Ej. Participación en clase, ejercicios resueltos." />
                  </div>
                </div>
                <Button
                  disabled={isLoading}
                  className="mt-4 bg-customBlue-500 text-white hover:bg-customBlue-700"
                  onClick={handleSavePlanification}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Planificación
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Formulario para registrar un nuevo profesor */}
      {isProfessorFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <ProfessorForm onCancel={() => setIsProfessorFormOpen(false)} onSubmit={handleNewProfessor} />
          </div>
        </div>
      )}
    </div>
  )
}

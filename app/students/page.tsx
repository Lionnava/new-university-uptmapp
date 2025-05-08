"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Search, UserPlus, FileDown, Filter } from "lucide-react"
import { StudentForm } from "@/components/students/student-form"
import { EnrollmentForm } from "@/components/enrollment/enrollment-form"

type Student = {
  id: string
  name: string
  cedula: string
  career: string
  status: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState("registro")
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false)
  const [isEnrollmentFormOpen, setIsEnrollmentFormOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  function handleNewStudent(values: any) {
    console.log("Nuevo estudiante:", values)
    // Aquí implementarías la lógica para guardar el estudiante en la base de datos
  }

  function handleEnrollment(values: any) {
    console.log("Inscripción:", values)
    // Aquí implementarías la lógica para guardar la inscripción en la base de datos
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-700 text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" className="text-white p-0 mr-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Gestión de Estudiantes</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <Tabs defaultValue="registro" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="registro">Registro de Estudiantes</TabsTrigger>
            <TabsTrigger value="inscripcion">Inscripción</TabsTrigger>
            <TabsTrigger value="censo">Censo Estudiantil</TabsTrigger>
          </TabsList>

          <TabsContent value="registro">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Registro de Estudiantes</CardTitle>
                <Button onClick={() => setIsStudentFormOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Nuevo Estudiante
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Buscar estudiantes..." className="pl-8" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="egresado">Egresado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                  <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Cédula</TableHead>
                        <TableHead>Carrera</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentData.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.cedula}</TableCell>
                          <TableCell>{student.career}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                student.status === "Activo"
                                  ? "bg-green-100 text-green-800"
                                  : student.status === "Inactivo"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {student.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Ver
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedStudent(student)
                                setIsStudentFormOpen(true)
                              }}
                            >
                              Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inscripcion">
            <Card>
              <CardHeader>
                <CardTitle>Proceso de Inscripción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Período Académico</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023-1">2023 - Trimestre I</SelectItem>
                          <SelectItem value="2023-2">2023 - Trimestre II</SelectItem>
                          <SelectItem value="2023-3">2023 - Trimestre III</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tipo de Inscripción</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Estudiante Regular</SelectItem>
                          <SelectItem value="nuevo">Nuevo Ingreso</SelectItem>
                          <SelectItem value="reingreso">Reingreso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Calendario de Inscripciones</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Estudiantes Regulares:</span>
                        <span className="font-medium">15/04/2023 - 20/04/2023</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Nuevo Ingreso:</span>
                        <span className="font-medium">22/04/2023 - 25/04/2023</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Casos Especiales:</span>
                        <span className="font-medium">27/04/2023 - 28/04/2023</span>
                      </li>
                    </ul>
                  </div>

                  <Button className="w-full" onClick={() => setIsEnrollmentFormOpen(true)}>
                    Iniciar Proceso de Inscripción
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="censo">
            <Card>
              <CardHeader>
                <CardTitle>Censo Estudiantil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Estudiantes Activos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,086</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Nuevos Ingresos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">180</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-4">Distribución por Carrera</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Ingeniería Informática</span>
                          <span>320 (25.6%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25.6%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Administración</span>
                          <span>280 (22.4%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "22.4%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Contaduría</span>
                          <span>245 (19.6%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "19.6%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Ingeniería Industrial</span>
                          <span>210 (16.8%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "16.8%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Otras</span>
                          <span>193 (15.6%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "15.6%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" className="mr-2">
                      <FileDown className="mr-2 h-4 w-4" />
                      Exportar Datos
                    </Button>
                    <Button>Ver Reporte Completo</Button>
                  </div>
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
      {isStudentFormOpen && (
        <StudentForm
          isOpen={isStudentFormOpen}
          onClose={() => {
            setIsStudentFormOpen(false)
            setSelectedStudent(null)
          }}
          onSubmit={handleNewStudent}
          initialData={
            selectedStudent
              ? {
                  firstName: selectedStudent.firstName || selectedStudent.name.split(" ")[0],
                  lastName: selectedStudent.lastName || selectedStudent.name.split(" ")[1],
                  cedula: selectedStudent.cedula,
                  birthDate: "",
                  gender: "masculino",
                  email: selectedStudent.email || "",
                  phone: selectedStudent.phone || "",
                  address: "",
                  career:
                    selectedStudent.career === "Ingeniería Informática"
                      ? "informatica"
                      : selectedStudent.career === "Administración"
                        ? "administracion"
                        : selectedStudent.career === "Contaduría"
                          ? "contaduria"
                          : "industrial",
                  admissionDate: "",
                  status: selectedStudent.status.toLowerCase(),
                }
              : undefined
          }
        />
      )}
      {isEnrollmentFormOpen && (
        <EnrollmentForm
          isOpen={isEnrollmentFormOpen}
          onClose={() => setIsEnrollmentFormOpen(false)}
          onSubmit={handleEnrollment}
        />
      )}
    </div>
  )
}

// Datos de ejemplo
const studentData = [
  {
    id: "EST-001",
    name: "Ana María Rodríguez",
    cedula: "V-25.789.456",
    career: "Ingeniería Informática",
    status: "Activo",
  },
  { id: "EST-002", name: "Carlos Eduardo Pérez", cedula: "V-26.123.789", career: "Administración", status: "Activo" },
  { id: "EST-003", name: "María Fernanda López", cedula: "V-24.567.890", career: "Contaduría", status: "Inactivo" },
  {
    id: "EST-004",
    name: "José Luis Martínez",
    cedula: "V-27.890.123",
    career: "Ingeniería Industrial",
    status: "Activo",
  },
  {
    id: "EST-005",
    name: "Luisa Alejandra Torres",
    cedula: "V-25.456.789",
    career: "Ingeniería Informática",
    status: "Egresado",
  },
]

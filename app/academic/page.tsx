"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Plus, Search, Filter, Calendar } from "lucide-react"
import { SubjectForm } from "@/components/academic/subject-form"
import { SectionForm } from "@/components/academic/section-form"
import { Badge } from "@/components/ui/badge"

export default function AcademicPage() {
  const [activeTab, setActiveTab] = useState("materias")
  const [isSubjectFormOpen, setIsSubjectFormOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [isSectionFormOpen, setIsSectionFormOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [periodFilter, setPeriodFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [subjectData, setSubjectData] = useState([
    {
      code: "INF-101",
      name: "Introducción a la Programación",
      credits: 4,
      department: "Informática",
      periodId: "2023-T1",
      isActive: true,
    },
    {
      code: "MAT-201",
      name: "Cálculo I",
      credits: 4,
      department: "Matemáticas",
      periodId: "2023-T1",
      isActive: true,
    },
    {
      code: "ADM-301",
      name: "Administración de Empresas",
      credits: 3,
      department: "Administración",
      periodId: "2023-T2",
      isActive: true,
    },
    {
      code: "CON-101",
      name: "Contabilidad Básica",
      credits: 3,
      department: "Contaduría",
      periodId: "2023-T2",
      isActive: false,
    },
    {
      code: "INF-202",
      name: "Estructura de Datos",
      credits: 4,
      department: "Informática",
      periodId: "2023-T3",
      isActive: true,
    },
  ])

  function handleNewSubject(values: any) {
    console.log("Nueva materia:", values)
    // Aquí implementarías la lógica para guardar la materia en la base de datos

    // Simulación de actualización de datos
    if (selectedSubject) {
      // Actualizar materia existente
      setSubjectData(
        subjectData.map((subject) =>
          subject.code === selectedSubject.code
            ? {
                ...subject,
                name: values.name,
                credits: values.credits,
                department:
                  values.department === "informatica"
                    ? "Informática"
                    : values.department === "matematicas"
                      ? "Matemáticas"
                      : values.department === "administracion"
                        ? "Administración"
                        : "Contaduría",
                periodId: values.periodId,
                isActive: values.isActive,
              }
            : subject,
        ),
      )
    } else {
      // Crear nueva materia
      const newSubject = {
        code: values.code,
        name: values.name,
        credits: values.credits,
        department:
          values.department === "informatica"
            ? "Informática"
            : values.department === "matematicas"
              ? "Matemáticas"
              : values.department === "administracion"
                ? "Administración"
                : "Contaduría",
        periodId: values.periodId,
        isActive: values.isActive,
      }
      setSubjectData([...subjectData, newSubject])
    }
  }

  function handleNewSection(values: any) {
    console.log("Nueva sección:", values)
    // Aquí implementarías la lógica para guardar la sección en la base de datos
  }

  // Filtrar materias por término de búsqueda y filtros
  const filteredSubjects = subjectData.filter((subject) => {
    // Filtro de búsqueda
    const matchesSearch =
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.department.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de período
    const matchesPeriod = periodFilter === "all" || subject.periodId === periodFilter

    // Filtro de departamento
    const matchesDepartment =
      departmentFilter === "all" ||
      subject.department.toLowerCase() ===
        (departmentFilter === "informatica"
          ? "informática"
          : departmentFilter === "matematicas"
            ? "matemáticas"
            : departmentFilter === "administracion"
              ? "administración"
              : "contaduría")

    return matchesSearch && matchesPeriod && matchesDepartment
  })

  // Obtener el nombre del período a partir del ID
  function getPeriodName(periodId: string) {
    const period = academicPeriods.find((p) => p.id === periodId)
    return period ? period.name : "No asignado"
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
            <h1 className="text-2xl font-bold">Gestión Académica</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <Tabs defaultValue="materias" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="materias">Materias</TabsTrigger>
            <TabsTrigger value="secciones">Secciones</TabsTrigger>
            <TabsTrigger value="planificacion">Planificación</TabsTrigger>
          </TabsList>

          <TabsContent value="materias">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestión de Materias</CardTitle>
                <Button onClick={() => setIsSubjectFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Materia
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar materias..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={periodFilter} onValueChange={setPeriodFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filtrar por período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los períodos</SelectItem>
                      {academicPeriods.map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filtrar por departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los departamentos</SelectItem>
                      <SelectItem value="informatica">Informática</SelectItem>
                      <SelectItem value="matematicas">Matemáticas</SelectItem>
                      <SelectItem value="administracion">Administración</SelectItem>
                      <SelectItem value="contaduria">Contaduría</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Más Filtros
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Créditos</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubjects.map((subject) => (
                        <TableRow key={subject.code}>
                          <TableCell>{subject.code}</TableCell>
                          <TableCell>{subject.name}</TableCell>
                          <TableCell>{subject.credits}</TableCell>
                          <TableCell>{subject.department}</TableCell>
                          <TableCell>{getPeriodName(subject.periodId)}</TableCell>
                          <TableCell>
                            {subject.isActive ? (
                              <Badge className="bg-green-500">Activa</Badge>
                            ) : (
                              <Badge variant="outline">Inactiva</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Ver
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSubject(subject)
                                setIsSubjectFormOpen(true)
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

          <TabsContent value="secciones">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestión de Secciones</CardTitle>
                <Button onClick={() => setIsSectionFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Sección
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Buscar secciones..." className="pl-8" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los períodos</SelectItem>
                      {academicPeriods.map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Materia</TableHead>
                        <TableHead>Profesor</TableHead>
                        <TableHead>Horario</TableHead>
                        <TableHead>Cupos</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sectionData.map((section) => (
                        <TableRow key={section.id}>
                          <TableCell>{section.id}</TableCell>
                          <TableCell>{section.subject}</TableCell>
                          <TableCell>{section.professor}</TableCell>
                          <TableCell>{section.schedule}</TableCell>
                          <TableCell>{section.capacity}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Ver
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSection(section)
                                setIsSectionFormOpen(true)
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

          <TabsContent value="planificacion">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Planificación Académica</CardTitle>
                <Link href="/calendar">
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Gestionar Períodos
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Período Académico</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicPeriods.map((period) => (
                            <SelectItem key={period.id} value={period.id}>
                              {period.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Carrera</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar carrera" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="informatica">Ingeniería Informática</SelectItem>
                          <SelectItem value="administracion">Administración</SelectItem>
                          <SelectItem value="contaduria">Contaduría</SelectItem>
                          <SelectItem value="industrial">Ingeniería Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Fechas Importantes</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Inicio de clases:</span>
                        <span className="font-medium">02/05/2023</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Fin de clases:</span>
                        <span className="font-medium">28/07/2023</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Evaluaciones finales:</span>
                        <span className="font-medium">31/07/2023 - 04/08/2023</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Entrega de notas:</span>
                        <span className="font-medium">07/08/2023</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-4">Planificación de Recursos</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Aulas Disponibles</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          <div className="border rounded p-2 text-center">A-101</div>
                          <div className="border rounded p-2 text-center">A-102</div>
                          <div className="border rounded p-2 text-center">A-103</div>
                          <div className="border rounded p-2 text-center">A-104</div>
                          <div className="border rounded p-2 text-center">B-201</div>
                          <div className="border rounded p-2 text-center">B-202</div>
                          <div className="border rounded p-2 text-center">B-203</div>
                          <div className="border rounded p-2 text-center">B-204</div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Laboratorios Disponibles</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          <div className="border rounded p-2 text-center">Lab-01</div>
                          <div className="border rounded p-2 text-center">Lab-02</div>
                          <div className="border rounded p-2 text-center">Lab-03</div>
                          <div className="border rounded p-2 text-center">Lab-04</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" className="mr-2">
                      Cancelar
                    </Button>
                    <Button>Generar Planificación</Button>
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
      {isSubjectFormOpen && (
        <SubjectForm
          isOpen={isSubjectFormOpen}
          onClose={() => {
            setIsSubjectFormOpen(false)
            setSelectedSubject(null)
          }}
          onSubmit={handleNewSubject}
          initialData={
            selectedSubject
              ? {
                  code: selectedSubject.code,
                  name: selectedSubject.name,
                  credits: selectedSubject.credits,
                  department:
                    selectedSubject.department.toLowerCase() === "informática"
                      ? "informatica"
                      : selectedSubject.department.toLowerCase() === "matemáticas"
                        ? "matematicas"
                        : selectedSubject.department.toLowerCase() === "administración"
                          ? "administracion"
                          : "contaduria",
                  description: selectedSubject.description || "Descripción de la materia",
                  prerequisites: selectedSubject.prerequisites || "",
                  periodId: selectedSubject.periodId,
                  isElective: selectedSubject.isElective || false,
                  isActive: selectedSubject.isActive !== undefined ? selectedSubject.isActive : true,
                }
              : undefined
          }
        />
      )}
      {isSectionFormOpen && (
        <SectionForm
          isOpen={isSectionFormOpen}
          onClose={() => {
            setIsSectionFormOpen(false)
            setSelectedSection(null)
          }}
          onSubmit={handleNewSection}
          initialData={
            selectedSection
              ? {
                  id: selectedSection.id,
                  subjectId: selectedSection.subject.substring(0, 7),
                  professorId: "",
                  period: "2023-1",
                  schedule: selectedSection.schedule,
                  classroom: "",
                  capacity: Number.parseInt(selectedSection.capacity.split("/")[1]),
                }
              : undefined
          }
        />
      )}
    </div>
  )
}

// Datos de ejemplo para los períodos académicos
const academicPeriods = [
  { id: "2023-T1", name: "Trimestre I 2023" },
  { id: "2023-T2", name: "Trimestre II 2023" },
  { id: "2023-T3", name: "Trimestre III 2023" },
  { id: "2024-T1", name: "Trimestre I 2024" },
]

// Datos de ejemplo para las materias
const sectionData = [
  {
    id: "SEC-001",
    subject: "Introducción a la Programación",
    professor: "Juan Pérez",
    schedule: "Lun-Mie 8:00-10:00",
    capacity: "30/30",
  },
  {
    id: "SEC-002",
    subject: "Cálculo I",
    professor: "María González",
    schedule: "Mar-Jue 10:00-12:00",
    capacity: "25/30",
  },
  {
    id: "SEC-003",
    subject: "Administración de Empresas",
    professor: "Carlos Rodríguez",
    schedule: "Lun-Mie 14:00-16:00",
    capacity: "28/30",
  },
  {
    id: "SEC-004",
    subject: "Contabilidad Básica",
    professor: "Ana López",
    schedule: "Mar-Jue 16:00-18:00",
    capacity: "22/30",
  },
  {
    id: "SEC-005",
    subject: "Estructura de Datos",
    professor: "Pedro Martínez",
    schedule: "Vie 8:00-12:00",
    capacity: "27/30",
  },
]

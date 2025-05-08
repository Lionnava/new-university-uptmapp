"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, UserCheck, Calendar, FileText, BarChart3, UserPlus, Loader2 } from "lucide-react"
import { UserNav } from "@/components/navigation/user-nav"
import { useAuth } from "@/contexts/auth-context"
import { MainNav } from "@/components/navigation/main-nav"

// Definición de los módulos
const modules = [
  {
    title: "Gestión de Estudiantes",
    description: "Censo, inscripción y registro de alumnos",
    href: "/students",
    icon: <Users className="h-16 w-16 text-blue-600" />,
    module: "students",
  },
  {
    title: "Gestión Académica",
    description: "Materias, secciones y planificación",
    href: "/academic",
    icon: <BookOpen className="h-16 w-16 text-blue-600" />,
    module: "subjects",
  },
  {
    title: "Portal Docente",
    description: "Evaluación y planificación de clases",
    href: "/teachers",
    icon: <UserCheck className="h-16 w-16 text-blue-600" />,
    module: "professors",
  },
  {
    title: "Calendario Académico",
    description: "Períodos y trayectos académicos",
    href: "/calendar",
    icon: <Calendar className="h-16 w-16 text-blue-600" />,
    module: "periods",
  },
  {
    title: "Reportes",
    description: "Informes y documentos académicos",
    href: "/reports",
    icon: <FileText className="h-16 w-16 text-blue-600" />,
    module: "reports",
  },
  {
    title: "Estadísticas",
    description: "Análisis de datos académicos",
    href: "/statistics",
    icon: <BarChart3 className="h-16 w-16 text-blue-600" />,
    module: "statistics",
  },
  {
    title: "Aspirantes",
    description: "Gestión de aspirantes y admisiones",
    href: "/aspirants",
    icon: <UserPlus className="h-16 w-16 text-blue-600" />,
    module: "aspirants",
  },
]

// Componente del lado del cliente para mostrar solo los módulos accesibles
function AccessibleModules() {
  const { hasPermission } = useAuth()
  const [accessibleModules, setAccessibleModules] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Filtrar los módulos según los permisos del usuario
    const filtered = modules.filter((module) => hasPermission(module.module, "view"))
    setAccessibleModules(filtered)
    setIsLoading(false)
  }, [hasPermission])

  if (isLoading) {
    return (
      <div className="col-span-3 flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (accessibleModules.length === 0) {
    return (
      <div className="col-span-3 text-center py-8">
        <p className="text-gray-500">No tienes acceso a ningún módulo del sistema.</p>
        <p className="text-gray-500 mt-2">Contacta al administrador para solicitar permisos.</p>
      </div>
    )
  }

  return (
    <>
      {accessibleModules.map((module) => (
        <Card key={module.href} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>{module.title}</CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center p-4">{module.icon}</div>
          </CardContent>
          <CardFooter>
            <Link href={module.href} className="w-full">
              <Button className="w-full">Acceder</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </>
  )
}

export default function Home() {
  const { user, isLoading } = useAuth()
  const [stats, setStats] = useState({
    students: { count: 0, increase: 0 },
    subjects: { count: 0, increase: 0 },
    professors: { count: 0, increase: 0 },
  })

  useEffect(() => {
    // En un entorno real, estos datos vendrían de una API
    // Simulamos la carga de datos
    const timer = setTimeout(() => {
      setStats({
        students: { count: 1248, increase: 180 },
        subjects: { count: 86, increase: 12 },
        professors: { count: 64, increase: 8 },
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Cargando sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-700 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Sistema de Gestión Universitaria</h1>
              <div className="md:hidden">
                <UserNav />
              </div>
            </div>
            <div className="flex items-center justify-between w-full md:w-auto">
              <MainNav />
              <div className="hidden md:block">
                <UserNav />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Panel de Control</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estudiantes Activos</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.students.count.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{stats.students.increase} desde el último trimestre</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Asignaturas Activas</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.subjects.count}</div>
                <p className="text-xs text-muted-foreground">+{stats.subjects.increase} desde el último trimestre</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profesores</CardTitle>
                <UserCheck className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.professors.count}</div>
                <p className="text-xs text-muted-foreground">+{stats.professors.increase} desde el último trimestre</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Módulos del Sistema</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AccessibleModules />
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 p-4 border-t">
        <div className="container mx-auto text-center text-sm text-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <span>
              <p>Desarrollado por</p> <span className="font-medium">Ing. Lionell Nava.</span>
            </span>
            <span>
              <p>© {new Date().getFullYear()} Uptma-Moján.</p> Derechos reservados.
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

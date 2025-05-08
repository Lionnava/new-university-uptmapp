"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Check, Info } from "lucide-react"

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-slate-900 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Sistema Universitario - Modo Preview</h1>
          <p className="mt-2 text-slate-300">Explora las funcionalidades del sistema en un entorno seguro de pruebas</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="features">Características</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
            <TabsTrigger value="test">Pruebas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Sistema</CardTitle>
                  <CardDescription>Verificación de componentes principales</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                      <span>Base de datos conectada</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                      <span>Autenticación configurada</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                      <span>API funcionando</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                      <span>Exportación de documentos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
                  <CardDescription>Datos de ejemplo cargados</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Estudiantes:</span>
                      <span className="font-medium">120</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Profesores:</span>
                      <span className="font-medium">45</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Asignaturas:</span>
                      <span className="font-medium">68</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Aspirantes:</span>
                      <span className="font-medium">85</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acceso Rápido</CardTitle>
                  <CardDescription>Navega a las secciones principales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full justify-start">
                    <Link href="/">Dashboard Principal</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/students">Gestión de Estudiantes</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/teachers">Gestión de Profesores</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/academic">Gestión Académica</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Registro e inicio de sesión de usuarios</li>
                    <li>Roles y permisos configurables</li>
                    <li>Recuperación de contraseña</li>
                    <li>Perfiles de usuario personalizables</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/auth/login">Probar inicio de sesión</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gestión Académica</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Administración de períodos académicos</li>
                    <li>Gestión de asignaturas y secciones</li>
                    <li>Trayectorias académicas</li>
                    <li>Planificación de horarios</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/academic">Explorar gestión académica</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Estudiantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Registro y actualización de datos</li>
                    <li>Historial académico</li>
                    <li>Inscripción en asignaturas</li>
                    <li>Seguimiento de calificaciones</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/students">Ver gestión de estudiantes</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reportes y Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Generación de constancias y certificados</li>
                    <li>Exportación en múltiples formatos (PDF, Excel, Word)</li>
                    <li>Reportes estadísticos</li>
                    <li>Documentos personalizables</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/reports">Explorar reportes</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Estudiantes",
                  description: "Gestión completa de estudiantes",
                  path: "/students",
                  status: "Completo",
                },
                {
                  title: "Profesores",
                  description: "Administración de docentes",
                  path: "/teachers",
                  status: "Completo",
                },
                {
                  title: "Aspirantes",
                  description: "Proceso de admisión",
                  path: "/aspirants",
                  status: "Completo",
                },
                {
                  title: "Académico",
                  description: "Gestión de períodos y asignaturas",
                  path: "/academic",
                  status: "Completo",
                },
                {
                  title: "Reportes",
                  description: "Generación de documentos",
                  path: "/reports",
                  status: "Completo",
                },
                {
                  title: "Calendario",
                  description: "Eventos y planificación",
                  path: "/calendar",
                  status: "Completo",
                },
                {
                  title: "Estadísticas",
                  description: "Análisis de datos",
                  path: "/statistics",
                  status: "Completo",
                },
                {
                  title: "Configuración",
                  description: "Ajustes del sistema",
                  path: "/settings",
                  status: "Completo",
                },
                {
                  title: "Autenticación",
                  description: "Gestión de usuarios y permisos",
                  path: "/auth/login",
                  status: "Completo",
                },
              ].map((module, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <span className="mr-2 font-medium">Estado:</span>
                      <span className="text-green-600 flex items-center">
                        <Check className="mr-1 h-4 w-4" />
                        {module.status}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={module.path}>Explorar</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pruebas del Sistema</CardTitle>
                <CardDescription>Verifica la funcionalidad de los componentes principales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={() => alert("Prueba de autenticación iniciada")}>Probar Autenticación</Button>
                  <Button onClick={() => alert("Prueba de CRUD iniciada")}>Probar Operaciones CRUD</Button>
                  <Button onClick={() => alert("Prueba de exportación iniciada")}>Probar Exportación</Button>
                  <Button onClick={() => alert("Prueba de base de datos iniciada")}>Probar Conexión a BD</Button>
                </div>

                <div className="bg-slate-100 p-4 rounded-md mt-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Información de Pruebas</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Estas pruebas se ejecutan en un entorno aislado y no afectan los datos reales del sistema. Para
                        pruebas más exhaustivas, utiliza los scripts de prueba desde la línea de comandos.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credenciales de Prueba</CardTitle>
                <CardDescription>Utiliza estas credenciales para probar diferentes roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-100 p-3 rounded-md">
                    <h4 className="font-medium">Administrador</h4>
                    <p className="text-sm">Email: admin@universidad.edu</p>
                    <p className="text-sm">Contraseña: admin123</p>
                  </div>

                  <div className="bg-slate-100 p-3 rounded-md">
                    <h4 className="font-medium">Profesor</h4>
                    <p className="text-sm">Email: profesor@universidad.edu</p>
                    <p className="text-sm">Contraseña: profesor123</p>
                  </div>

                  <div className="bg-slate-100 p-3 rounded-md">
                    <h4 className="font-medium">Estudiante</h4>
                    <p className="text-sm">Email: estudiante@universidad.edu</p>
                    <p className="text-sm">Contraseña: estudiante123</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-slate-900 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>Sistema Universitario - Modo Preview</p>
          <p className="text-sm text-slate-400 mt-1">
            Este es un entorno de prueba. Los datos mostrados son de ejemplo.
          </p>
        </div>
      </footer>
    </div>
  )
}

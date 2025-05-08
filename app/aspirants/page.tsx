"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Plus, Search, FileDown, Printer, Edit, Trash2 } from "lucide-react"
import { AspirantForm } from "@/components/aspirants/aspirant-form"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getAllAspirants, saveAspirant } from "@/lib/data-service"
import { generatePDF, generateExcel } from "@/lib/report-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AspirantsPage() {
  const [activeTab, setActiveTab] = useState("registro")
  const [isAspirantFormOpen, setIsAspirantFormOpen] = useState(false)
  const [selectedAspirant, setSelectedAspirant] = useState<any>(null)
  const [aspirants, setAspirants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [aspirantToDelete, setAspirantToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadAspirants()
  }, [])

  async function loadAspirants() {
    setIsLoading(true)
    try {
      const result = await getAllAspirants()
      if (result.success) {
        setAspirants(result.data)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "No se pudieron cargar los aspirantes.",
        })
      }
    } catch (error) {
      console.error("Error al cargar aspirantes:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al cargar los aspirantes.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleNewAspirant(values: any) {
    try {
      const result = await saveAspirant(values)
      if (result.success) {
        toast({
          title: selectedAspirant ? "Aspirante actualizado" : "Aspirante registrado",
          description: selectedAspirant
            ? "Los datos del aspirante han sido actualizados correctamente."
            : "El aspirante ha sido registrado correctamente.",
        })
        loadAspirants()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "No se pudo guardar los datos del aspirante.",
        })
      }
    } catch (error) {
      console.error("Error al guardar aspirante:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      })
    }
  }

  function handleDeleteClick(id: string) {
    setAspirantToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!aspirantToDelete) return

    try {
      // Aquí implementarías la lógica para eliminar el aspirante
      // Por ahora, simplemente actualizamos el estado local
      setAspirants(aspirants.filter((aspirant) => aspirant.id !== aspirantToDelete))

      toast({
        title: "Aspirante eliminado",
        description: "El aspirante ha sido eliminado correctamente.",
      })
    } catch (error) {
      console.error("Error al eliminar aspirante:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el aspirante.",
      })
    } finally {
      setAspirantToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  function handleExportData(format: string) {
    try {
      const filteredAspirants = getFilteredAspirants()

      const reportData = {
        title: "Registro de Aspirantes",
        subtitle: "Universidad Nacional",
        date: new Date().toLocaleDateString(),
        columns: ["ID", "Nombre", "Cédula", "Correo", "Teléfono", "Carrera Deseada", "Estado"],
        data: filteredAspirants.map((aspirant) => ({
          id: aspirant.aspirantId,
          nombre: `${aspirant.user.firstName} ${aspirant.user.lastName}`,
          cedula: aspirant.user.cedula,
          correo: aspirant.user.email,
          telefono: aspirant.user.phone || "N/A",
          carrera: aspirant.desiredCareer?.name || "No especificada",
          estado: getStatusLabel(aspirant.status),
        })),
        footer: `Sistema de Gestión Universitaria - ${new Date().getFullYear()}`,
      }

      if (format === "pdf") {
        generatePDF(reportData)
      } else if (format === "excel") {
        generateExcel(reportData)
      }

      toast({
        title: `Exportación a ${format.toUpperCase()}`,
        description: `Los datos han sido exportados en formato ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error(`Error al exportar a ${format}:`, error)
      toast({
        variant: "destructive",
        title: "Error de exportación",
        description: `No se pudo exportar los datos en formato ${format.toUpperCase()}.`,
      })
    }
  }

  function handlePrint() {
    try {
      window.print()
      toast({
        title: "Impresión iniciada",
        description: "El documento se está enviando a la impresora.",
      })
    } catch (error) {
      console.error("Error al imprimir:", error)
      toast({
        variant: "destructive",
        title: "Error de impresión",
        description: "No se pudo iniciar la impresión.",
      })
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "pendiente":
        return "Pendiente"
      case "aprobado":
        return "Aprobado"
      case "rechazado":
        return "Rechazado"
      default:
        return status
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pendiente":
        return <Badge className="bg-yellow-500">Pendiente</Badge>
      case "aprobado":
        return <Badge className="bg-green-500">Aprobado</Badge>
      case "rechazado":
        return <Badge className="bg-red-500">Rechazado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function getFilteredAspirants() {
    return aspirants.filter((aspirant) => {
      // Filtro de búsqueda
      const searchMatch =
        searchTerm === "" ||
        aspirant.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aspirant.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aspirant.user.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aspirant.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (aspirant.desiredCareer?.name || "").toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro de estado
      const statusMatch = statusFilter === "all" || aspirant.status === statusFilter

      return searchMatch && statusMatch
    })
  }

  const filteredAspirants = getFilteredAspirants()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-customBlue-700 text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" className="text-white p-0 mr-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Censo de Aspirantes</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <Tabs defaultValue="registro" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="registro">Registro de Aspirantes</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="registro">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestión de Aspirantes</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="text-customBlue-700 border-customBlue-700 hover:bg-customBlue-50"
                    onClick={() => handleExportData("pdf")}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="text-customBlue-700 border-customBlue-700 hover:bg-customBlue-50"
                    onClick={() => handleExportData("excel")}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar Excel
                  </Button>
                  <Button
                    variant="outline"
                    className="text-customBlue-700 border-customBlue-700 hover:bg-customBlue-50"
                    onClick={handlePrint}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedAspirant(null)
                      setIsAspirantFormOpen(true)
                    }}
                    className="bg-customBlue-600 hover:bg-customBlue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Aspirante
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar aspirantes..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="aprobado">Aprobado</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Cédula</TableHead>
                        <TableHead>Correo</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Carrera Deseada</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            Cargando aspirantes...
                          </TableCell>
                        </TableRow>
                      ) : filteredAspirants.length > 0 ? (
                        filteredAspirants.map((aspirant) => (
                          <TableRow key={aspirant.id}>
                            <TableCell>{aspirant.aspirantId}</TableCell>
                            <TableCell>{`${aspirant.user.firstName} ${aspirant.user.lastName}`}</TableCell>
                            <TableCell>{aspirant.user.cedula}</TableCell>
                            <TableCell>{aspirant.user.email}</TableCell>
                            <TableCell>{aspirant.user.phone || "N/A"}</TableCell>
                            <TableCell>{aspirant.desiredCareer?.name || "No especificada"}</TableCell>
                            <TableCell>{getStatusBadge(aspirant.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-customBlue-600 hover:text-customBlue-800 hover:bg-customBlue-50"
                                  onClick={() => {
                                    setSelectedAspirant(aspirant)
                                    setIsAspirantFormOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteClick(aspirant.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            No se encontraron aspirantes con los criterios de búsqueda.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estadisticas">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Aspirantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Aspirantes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{aspirants.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Aspirantes Aprobados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {aspirants.filter((a) => a.status === "aprobado").length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Aspirantes Pendientes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {aspirants.filter((a) => a.status === "pendiente").length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-4">Distribución por Carrera Deseada</h3>
                    <div className="space-y-2">
                      {/* Aquí se mostrarían gráficos o estadísticas más detalladas */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Ingeniería Informática</span>
                          <span>45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-customBlue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Administración</span>
                          <span>30%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-customBlue-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Contaduría</span>
                          <span>15%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-customBlue-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Ingeniería Industrial</span>
                          <span>10%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-customBlue-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="mr-2 text-customBlue-700 border-customBlue-700 hover:bg-customBlue-50"
                      onClick={() => handleExportData("pdf")}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Exportar Estadísticas
                    </Button>
                    <Button className="bg-customBlue-600 hover:bg-customBlue-700" onClick={handlePrint}>
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimir Reporte
                    </Button>
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

      {/* Formulario de aspirante */}
      {isAspirantFormOpen && (
        <AspirantForm
          isOpen={isAspirantFormOpen}
          onClose={() => {
            setIsAspirantFormOpen(false)
            setSelectedAspirant(null)
          }}
          onSubmit={handleNewAspirant}
          initialData={selectedAspirant}
        />
      )}

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al aspirante y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

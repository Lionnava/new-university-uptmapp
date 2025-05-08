"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Plus, Eye, Trash2, BookOpen } from "lucide-react"

interface Material {
  id: string
  title: string
  description: string
  fileUrl: string
  createdAt: Date
}

interface ClassMaterialsProps {
  courseId: string
}

export function ClassMaterials({ courseId }: ClassMaterialsProps) {
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: "1",
      title: "Introducción a la materia",
      description: "Material introductorio del curso",
      fileUrl: "/materials/intro.pdf",
      createdAt: new Date("2023-09-01"),
    },
    {
      id: "2",
      title: "Guía de ejercicios",
      description: "Ejercicios prácticos para el primer parcial",
      fileUrl: "/materials/exercises.pdf",
      createdAt: new Date("2023-09-15"),
    },
  ])

  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null)

  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    file: null as File | null,
  })

  const handleAddMaterial = () => {
    if (!newMaterial.title || !newMaterial.file) return

    const material: Material = {
      id: Date.now().toString(),
      title: newMaterial.title,
      description: newMaterial.description,
      fileUrl: URL.createObjectURL(newMaterial.file),
      createdAt: new Date(),
    }

    setMaterials([...materials, material])
    setNewMaterial({ title: "", description: "", file: null })
    setOpen(false)
  }

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id))
  }

  const handleViewMaterial = (material: Material) => {
    setCurrentMaterial(material)
    setViewOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewMaterial({ ...newMaterial, file: e.target.files[0] })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Materiales de Clase</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Material de Clase</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Título
                </label>
                <Input
                  id="title"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descripción
                </label>
                <Textarea
                  id="description"
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="file" className="text-sm font-medium">
                  Archivo
                </label>
                <Input id="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleFileChange} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="save" onClick={handleAddMaterial} disabled={!newMaterial.title || !newMaterial.file}>
                Guardar Material
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell className="font-medium">{material.title}</TableCell>
              <TableCell>{material.description}</TableCell>
              <TableCell>{material.createdAt.toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleViewMaterial(material)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteMaterial(material.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentMaterial?.title}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">{currentMaterial?.description}</p>

            <div className="border rounded-md p-4 flex items-center justify-center bg-muted h-64">
              <div className="text-center">
                <FileText className="mx-auto h-16 w-16 text-blue-500" />
                <p className="mt-2">Vista previa no disponible</p>
                <Button variant="link" className="mt-2" onClick={() => window.open(currentMaterial?.fileUrl, "_blank")}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Abrir documento
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

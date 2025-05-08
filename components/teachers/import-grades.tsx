"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImportGradesProps {
  onImport: (data: any[]) => void
  courseId: string
}

export function ImportGrades({ onImport, courseId }: ImportGradesProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleImport = async () => {
    if (!file) {
      setError("Por favor seleccione un archivo")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulación de procesamiento de archivo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aquí iría la lógica real para procesar el archivo Excel/CSV
      // Por ahora, simulamos datos de ejemplo
      const mockData = [
        { studentId: "1001", name: "Juan Pérez", grade: 85 },
        { studentId: "1002", name: "María López", grade: 92 },
        { studentId: "1003", name: "Carlos Rodríguez", grade: 78 },
      ]

      onImport(mockData)
      setOpen(false)
    } catch (err) {
      setError("Error al procesar el archivo. Verifique el formato.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Upload className="mr-2 h-4 w-4" />
          Importar Notas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Calificaciones</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="file-upload" className="text-sm font-medium">
              Seleccione archivo Excel o CSV
            </label>
            <Input id="file-upload" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
            <p className="text-xs text-muted-foreground">
              El archivo debe contener columnas para ID del estudiante, nombre y calificación
            </p>
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>{file.name}</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="save" onClick={handleImport} disabled={!file || isLoading}>
            {isLoading ? "Procesando..." : "Importar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

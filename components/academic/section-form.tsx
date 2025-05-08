"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  id: z.string().regex(/^SEC-\d{3}$/, {
    message: "El ID debe tener el formato SEC-000 (ej: SEC-001).",
  }),
  subjectId: z.string({
    required_error: "Por favor seleccione una materia.",
  }),
  professorId: z.string({
    required_error: "Por favor seleccione un profesor.",
  }),
  periodId: z.string({
    required_error: "Por favor seleccione un período académico.",
  }),
  schedule: z.string().min(5, {
    message: "El horario debe tener al menos 5 caracteres.",
  }),
  classroom: z.string().min(1, {
    message: "Debe seleccionar un aula.",
  }),
  capacity: z.coerce.number().min(1).max(100),
})

// Datos de ejemplo para las materias
const subjects = [
  { id: "INF-101", name: "Introducción a la Programación" },
  { id: "MAT-201", name: "Cálculo I" },
  { id: "ADM-301", name: "Administración de Empresas" },
  { id: "CON-101", name: "Contabilidad Básica" },
  { id: "INF-202", name: "Estructura de Datos" },
]

// Datos de ejemplo para los profesores
const professors = [
  { id: "PROF-001", name: "Juan Pérez" },
  { id: "PROF-002", name: "María González" },
  { id: "PROF-003", name: "Carlos Rodríguez" },
  { id: "PROF-004", name: "Ana López" },
  { id: "PROF-005", name: "Pedro Martínez" },
]

// Datos de ejemplo para los períodos académicos
const academicPeriods = [
  { id: "2025-T1", name: "Trimestre I 2025" },
  { id: "2025-T1", name: "Trimestre II 2025" },
  { id: "2025-T1", name: "Trimestre III 2025" },
  { id: "2026-T1", name: "Trimestre I 2026" },
]

// Datos de ejemplo para las aulas
const classrooms = [
  "A-101",
  "A-102",
  "A-103",
  "A-104",
  "B-201",
  "B-202",
  "B-203",
  "B-204",
  "Lab-01",
  "Lab-02",
  "Lab-03",
  "Lab-04",
]

type SectionFormProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: z.infer<typeof formSchema>) => void
  initialData?: z.infer<typeof formSchema>
}

export function SectionForm({ isOpen, onClose, onSubmit, initialData }: SectionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      id: "",
      subjectId: "",
      professorId: "",
      periodId: "",
      schedule: "",
      classroom: "",
      capacity: 30,
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Sección" : "Registrar Nueva Sección"}</DialogTitle>
          <DialogDescription>
            Complete la información para {initialData ? "actualizar los datos de la" : "registrar una nueva"} sección en
            el sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de Sección</FormLabel>
                  <FormControl>
                    <Input placeholder="SEC-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar materia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.id} - {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="professorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profesor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar profesor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {professors.map((professor) => (
                          <SelectItem key={professor.id} value={professor.id}>
                            {professor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="periodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período Académico</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicPeriods.map((period) => (
                          <SelectItem key={period.id} value={period.id}>
                            {period.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horario</FormLabel>
                    <FormControl>
                      <Input placeholder="Lun-Mie 8:00-10:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classroom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aula</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar aula" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classrooms.map((classroom) => (
                          <SelectItem key={classroom} value={classroom}>
                            {classroom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{initialData ? "Actualizar" : "Registrar"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

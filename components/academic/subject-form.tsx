"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { saveSubject } from "@/lib/data-service"

const formSchema = z.object({
  code: z.string().regex(/^[A-Z]{3}-\d{3}$/, {
    message: "El código debe tener el formato XXX-000 (ej: INF-101).",
  }),
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  credits: z.coerce.number().min(1).max(10),
  department: z.string({
    required_error: "Por favor seleccione un departamento.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  prerequisites: z.string().optional(),
  periodId: z.string({
    required_error: "Por favor seleccione un período académico.",
  }),
  isElective: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

// Datos de ejemplo para los períodos académicos
const academicPeriods = [
  { id: "2023-T1", name: "Trimestre I 2023" },
  { id: "2023-T2", name: "Trimestre II 2023" },
  { id: "2023-T3", name: "Trimestre III 2023" },
  { id: "2024-T1", name: "Trimestre I 2024" },
]

type SubjectFormProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: z.infer<typeof formSchema>) => void
  initialData?: z.infer<typeof formSchema>
}

export function SubjectForm({ isOpen, onClose, onSubmit, initialData }: SubjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      code: "",
      name: "",
      credits: 4,
      department: "",
      description: "",
      prerequisites: "",
      periodId: "",
      isElective: false,
      isActive: true,
    },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Guardar en la base de datos
      const result = await saveSubject(values)

      if (result.success) {
        toast({
          title: initialData ? "Materia actualizada" : "Materia registrada",
          description: initialData
            ? "Los datos de la materia han sido actualizados correctamente."
            : "La materia ha sido registrada correctamente.",
        })

        // Llamar al callback de onSubmit
        onSubmit(values)

        // Cerrar el formulario
        form.reset()
        onClose()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "No se pudo guardar los datos de la materia.",
        })
      }
    } catch (error) {
      console.error("Error al guardar materia:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Materia" : "Registrar Nueva Materia"}</DialogTitle>
          <DialogDescription>
            Complete la información para {initialData ? "actualizar los datos de la" : "registrar una nueva"} materia en
            el sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="INF-101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Créditos</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la materia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="informatica">Informática</SelectItem>
                        <SelectItem value="matematicas">Matemáticas</SelectItem>
                        <SelectItem value="administracion">Administración</SelectItem>
                        <SelectItem value="contaduria">Contaduría</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción detallada de la materia" {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerrequisitos</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: INF-101, MAT-201" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isElective"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Materia Electiva</FormLabel>
                      <p className="text-sm text-muted-foreground">Marque si esta es una materia electiva.</p>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Materia Activa</FormLabel>
                      <p className="text-sm text-muted-foreground">Marque si esta materia está activa.</p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
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
                    {initialData ? "Actualizando..." : "Registrando..."}
                  </span>
                ) : (
                  <>{initialData ? "Actualizar" : "Registrar"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

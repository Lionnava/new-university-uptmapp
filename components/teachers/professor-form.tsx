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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { saveProfessor } from "@/lib/data-service"

const formSchema = z.object({
  id: z.string().min(2, {
    message: "El ID debe tener al menos 2 caracteres.",
  }),
  firstName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastName: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  cedula: z.string().regex(/^[VE]-\d{7,8}$/, {
    message: "La cédula debe tener el formato V-1234567 o E-1234567.",
  }),
  department: z.string({
    required_error: "Por favor seleccione un departamento.",
  }),
  education: z.string().min(2, {
    message: "El grado académico debe tener al menos 2 caracteres.",
  }),
  specialization: z.string().min(2, {
    message: "La especialización debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Correo electrónico inválido.",
  }),
  phone: z.string().min(10, {
    message: "Número de teléfono inválido.",
  }),
  hireDateMonth: z.string(),
  hireDateYear: z.string(),
  contractType: z.enum(["tiempo_completo", "tiempo_parcial", "por_hora"]),
  status: z.enum(["activo", "inactivo", "sabático", "permiso"]),
})

type ProfessorFormProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: z.infer<typeof formSchema>) => void
  initialData?: z.infer<typeof formSchema>
}

export function ProfessorForm({ isOpen, onClose, onSubmit, initialData }: ProfessorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      id: "",
      firstName: "",
      lastName: "",
      cedula: "",
      department: "",
      education: "",
      specialization: "",
      email: "",
      phone: "",
      hireDateMonth: new Date().getMonth().toString(),
      hireDateYear: new Date().getFullYear().toString(),
      contractType: "tiempo_completo",
      status: "activo",
    },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Guardar en la base de datos
      const result = await saveProfessor(values)

      if (result.success) {
        toast({
          title: initialData ? "Profesor actualizado" : "Profesor registrado",
          description: initialData
            ? "Los datos del profesor han sido actualizados correctamente."
            : "El profesor ha sido registrado correctamente.",
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
          description: result.error || "No se pudo guardar los datos del profesor.",
        })
      }
    } catch (error) {
      console.error("Error al guardar profesor:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  // Generar años para el formulario (desde 1990 hasta año actual)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => (currentYear - i).toString())

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Profesor" : "Registrar Nuevo Profesor"}</DialogTitle>
          <DialogDescription>
            Complete la información para {initialData ? "actualizar los datos del" : "registrar un nuevo"} profesor en
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
                  <FormLabel>ID/Código</FormLabel>
                  <FormControl>
                    <Input placeholder="PROF-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del profesor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Apellido del profesor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cedula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cédula</FormLabel>
                  <FormControl>
                    <Input placeholder="V-12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grado Académico</FormLabel>
                    <FormControl>
                      <Input placeholder="Doctor en Informática" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialización</FormLabel>
                    <FormControl>
                      <Input placeholder="Inteligencia Artificial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+58 412 1234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hireDateMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mes de Contratación</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar mes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {month}
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
                name="hireDateYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año de Contratación</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar año" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
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
              name="contractType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Contrato</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="tiempo_completo" />
                        </FormControl>
                        <FormLabel className="font-normal">Tiempo Completo</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="tiempo_parcial" />
                        </FormControl>
                        <FormLabel className="font-normal">Tiempo Parcial</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="por_hora" />
                        </FormControl>
                        <FormLabel className="font-normal">Por Hora</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="sabático">Sabático</SelectItem>
                      <SelectItem value="permiso">Permiso</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

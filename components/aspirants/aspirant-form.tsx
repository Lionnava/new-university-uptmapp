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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastName: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  cedula: z.string().regex(/^[VE]-\d{7,8}$/, {
    message: "La cédula debe tener el formato V-1234567 o E-1234567.",
  }),
  email: z.string().email({
    message: "Correo electrónico inválido.",
  }),
  phone: z.string().min(10, {
    message: "Número de teléfono inválido.",
  }),
  address: z.string().optional(),
  career: z.string({
    required_error: "Por favor seleccione una carrera.",
  }),
  educationLevel: z.string().optional(),
  previousInstitution: z.string().optional(),
  howDidYouHear: z.string().optional(),
  comments: z.string().optional(),
  status: z.enum(["pendiente", "contactado", "inscrito", "rechazado"]),
})

type AspirantFormProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: z.infer<typeof formSchema>) => void
  initialData?: z.infer<typeof formSchema>
}

export function AspiriantForm({ isOpen, onClose, onSubmit, initialData }: AspirantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      cedula: "",
      email: "",
      phone: "",
      address: "",
      career: "",
      educationLevel: "",
      previousInstitution: "",
      howDidYouHear: "",
      comments: "",
      status: "pendiente",
    },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Simular un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSubmit(values)
      form.reset()
      onClose()
    } catch (error) {
      console.error("Error al guardar aspirante:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Aspirante" : "Registrar Nuevo Aspirante"}</DialogTitle>
          <DialogDescription>
            Complete la información para {initialData ? "actualizar los datos del" : "registrar un nuevo"} aspirante en
            el sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del aspirante" {...field} />
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
                      <Input placeholder="Apellido del aspirante" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="career"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrera de Interés</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar carrera" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="informatica">Ingeniería Informática</SelectItem>
                        <SelectItem value="administracion">Administración</SelectItem>
                        <SelectItem value="contaduria">Contaduría</SelectItem>
                        <SelectItem value="industrial">Ingeniería Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Dirección completa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel Educativo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar nivel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bachiller">Bachiller</SelectItem>
                        <SelectItem value="tecnico">Técnico Superior</SelectItem>
                        <SelectItem value="universitario">Universitario Incompleto</SelectItem>
                        <SelectItem value="graduado">Graduado Universitario</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="previousInstitution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institución Anterior</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la institución" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="howDidYouHear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Cómo se enteró de nosotros?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar opción" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="redes">Redes Sociales</SelectItem>
                      <SelectItem value="amigo">Recomendación de un Amigo</SelectItem>
                      <SelectItem value="web">Página Web</SelectItem>
                      <SelectItem value="prensa">Prensa o Radio</SelectItem>
                      <SelectItem value="feria">Feria Educativa</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentarios Adicionales</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Comentarios o notas sobre el aspirante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="pendiente" />
                        </FormControl>
                        <FormLabel className="font-normal">Pendiente</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="contactado" />
                        </FormControl>
                        <FormLabel className="font-normal">Contactado</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="inscrito" />
                        </FormControl>
                        <FormLabel className="font-normal">Inscrito</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="rechazado" />
                        </FormControl>
                        <FormLabel className="font-normal">Rechazado</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
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

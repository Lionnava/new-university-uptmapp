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
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { savePeriod } from "@/lib/data-service"

const formSchema = z.object({
  id: z.string().min(1, {
    message: "El ID es obligatorio.",
  }),
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  year: z.coerce.number().min(2000).max(2100),
  trimester: z.enum(["1", "2", "3"]),
  startDate: z.date({
    required_error: "La fecha de inicio es obligatoria.",
  }),
  endDate: z
    .date({
      required_error: "La fecha de fin es obligatoria.",
    })
    .refine(
      (date, ctx) => {
        const startDate = ctx.parent.startDate
        return date > startDate
      },
      {
        message: "La fecha de fin debe ser posterior a la fecha de inicio.",
      },
    ),
  enrollmentStartDate: z.date({
    required_error: "La fecha de inicio de inscripciones es obligatoria.",
  }),
  enrollmentEndDate: z
    .date({
      required_error: "La fecha de fin de inscripciones es obligatoria.",
    })
    .refine(
      (date, ctx) => {
        const startDate = ctx.parent.enrollmentStartDate
        return date > startDate
      },
      {
        message: "La fecha de fin de inscripciones debe ser posterior a la fecha de inicio.",
      },
    ),
  isActive: z.boolean().default(false),
})

type PeriodFormProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: z.infer<typeof formSchema>) => void
  initialData?: z.infer<typeof formSchema>
}

export function PeriodForm({ isOpen, onClose, onSubmit, initialData }: PeriodFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      id: "",
      name: "",
      year: new Date().getFullYear(),
      trimester: "1",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      enrollmentStartDate: new Date(new Date().setDate(new Date().getDate() - 14)),
      enrollmentEndDate: new Date(new Date().setDate(new Date().getDate() - 7)),
      isActive: false,
    },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Guardar en la base de datos
      const result = await savePeriod({
        code: values.id,
        name: values.name,
        year: values.year,
        trimester: values.trimester,
        startDate: values.startDate,
        endDate: values.endDate,
        enrollmentStartDate: values.enrollmentStartDate,
        enrollmentEndDate: values.enrollmentEndDate,
        isActive: values.isActive,
      })

      if (result.success) {
        toast({
          title: initialData ? "Período actualizado" : "Período registrado",
          description: initialData
            ? "Los datos del período han sido actualizados correctamente."
            : "El período ha sido registrado correctamente.",
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
          description: result.error || "No se pudo guardar los datos del período.",
        })
      }
    } catch (error) {
      console.error("Error al guardar período:", error)
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
          <DialogTitle>{initialData ? "Editar Período Académico" : "Crear Nuevo Período Académico"}</DialogTitle>
          <DialogDescription>
            Complete la información para {initialData ? "actualizar los datos del" : "crear un nuevo"} período
            académico.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input placeholder="2023-T1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Trimestre I 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input type="number" min="2000" max="2100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trimester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trimestre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar trimestre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Trimestre I</SelectItem>
                        <SelectItem value="2">Trimestre II</SelectItem>
                        <SelectItem value="3">Trimestre III</SelectItem>
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
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("2000-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("2000-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="enrollmentStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Inicio de Inscripciones</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("2000-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enrollmentEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fin de Inscripciones</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("2000-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Período Activo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Marque esta opción si este es el período académico actual.
                    </p>
                  </div>
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
                    {initialData ? "Actualizando..." : "Creando..."}
                  </span>
                ) : (
                  <>{initialData ? "Actualizar" : "Crear"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

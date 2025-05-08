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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  id: z.string().min(1, {
    message: "El ID es obligatorio.",
  }),
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  academicYear: z.string().min(4, {
    message: "El año académico es obligatorio.",
  }),
  description: z.string().optional(),
  firstPeriodId: z.string({
    required_error: "El primer trimestre es obligatorio.",
  }),
  secondPeriodId: z.string({
    required_error: "El segundo trimestre es obligatorio.",
  }),
  thirdPeriodId: z.string({
    required_error: "El tercer trimestre es obligatorio.",
  }),
  isActive: z.boolean().default(false),
})

// Datos de ejemplo para los períodos académicos
const academicPeriods = [
  { id: "2023-T1", name: "Trimestre I 2023" },
  { id: "2023-T2", name: "Trimestre II 2023" },
  { id: "2023-T3", name: "Trimestre III 2023" },
  { id: "2024-T1", name: "Trimestre I 2024" },
  { id: "2024-T2", name: "Trimestre II 2024" },
  { id: "2024-T3", name: "Trimestre III 2024" },
]

type TrajectoryFormProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: z.infer<typeof formSchema>) => void
  initialData?: z.infer<typeof formSchema>
}

export function TrajectoryForm({ isOpen, onClose, onSubmit, initialData }: TrajectoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      id: "",
      name: "",
      academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      description: "",
      firstPeriodId: "",
      secondPeriodId: "",
      thirdPeriodId: "",
      isActive: false,
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
          <DialogTitle>{initialData ? "Editar Trayecto Académico" : "Crear Nuevo Trayecto Académico"}</DialogTitle>
          <DialogDescription>
            Complete la información para {initialData ? "actualizar los datos del" : "crear un nuevo"} trayecto
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
                      <Input placeholder="TRAY-2023-2024" {...field} />
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
                      <Input placeholder="Año Académico 2023-2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año Académico</FormLabel>
                  <FormControl>
                    <Input placeholder="2023-2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción del trayecto académico" {...field} className="min-h-[80px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Períodos Académicos</h3>

              <FormField
                control={form.control}
                name="firstPeriodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primer Trimestre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar primer trimestre" />
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
                name="secondPeriodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segundo Trimestre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar segundo trimestre" />
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
                name="thirdPeriodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tercer Trimestre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tercer trimestre" />
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Trayecto Activo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Marque esta opción si este es el trayecto académico actual.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{initialData ? "Actualizar" : "Crear"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

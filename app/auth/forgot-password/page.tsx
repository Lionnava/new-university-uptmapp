"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Aquí iría la lógica real de recuperación de contraseña
      // Por ahora, simulamos un proceso exitoso después de 1 segundo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      toast({
        title: "Solicitud enviada",
        description: "Se ha enviado un enlace de recuperación a su correo electrónico.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar su solicitud. Intente nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">Sistema de Gestión Universitaria</h1>
          <p className="mt-2 text-gray-600">Recuperación de contraseña</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recuperar Contraseña</CardTitle>
            <CardDescription>
              {!isSubmitted
                ? "Ingrese su correo electrónico para recibir instrucciones de recuperación"
                : "Revise su bandeja de entrada para continuar con el proceso"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
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
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Instrucciones
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
                  <p>
                    Hemos enviado un correo electrónico a <strong>{email}</strong> con instrucciones para restablecer su
                    contraseña.
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Si no recibe el correo en unos minutos, revise su carpeta de spam o solicite un nuevo enlace.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEmail("")
                    setIsSubmitted(false)
                  }}
                >
                  Solicitar nuevo enlace
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Volver a Iniciar Sesión
            </Link>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Sistema de Gestión Universitaria © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}

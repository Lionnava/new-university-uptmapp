import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Toaster } from "@/components/ui/toaster"
import { PreviewBanner } from "@/lib/preview-utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Gestión Universitaria",
  description: "Plataforma integral para la gestión académica universitaria",
  keywords: "universidad, gestión académica, estudiantes, profesores, materias",
  authors: [{ name: "Ing. Lionell Nava", url: "https://uptma-mojan.edu.ve" }],
  creator: "Uptma-Moján",
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ProtectedRoute>{children}</ProtectedRoute>
            <Toaster />
            <PreviewBanner />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

"use client"

import { usePathname } from "next/navigation"
import { AlertTriangle } from "lucide-react"

// Función para verificar si estamos en modo preview
export function isPreviewMode() {
  // En un entorno real, esto podría verificar una variable de entorno o un parámetro
  // Para este ejemplo, asumimos que siempre estamos en modo preview cuando accedemos a /preview
  return process.env.NEXT_PUBLIC_PREVIEW_MODE === "true"
}

// Componente para mostrar un banner de preview
export function PreviewBanner() {
  const pathname = usePathname()
  const isPreview = isPreviewMode() || pathname?.includes("/preview")

  if (!isPreview) return null

  return (
    <div className="rounded-none border-b border-yellow-500 bg-yellow-100 text-yellow-900 p-4 flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      <div>
        <p className="font-bold">Modo Vista Previa</p>
        <p className="text-sm">Estás en modo de vista previa. Los cambios no afectarán los datos reales.</p>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, FileSpreadsheet, FileIcon as FilePdf, Printer } from "lucide-react"

interface ExportButtonProps {
  onExport: (format: "pdf" | "excel" | "doc" | "print") => void
  disabled?: boolean
}

export function ExportButton({ onExport, disabled = false }: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="export" disabled={disabled}>
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onExport("pdf")}>
          <FilePdf className="mr-2 h-4 w-4" />
          <span>PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("excel")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("doc")}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Word</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("print")}>
          <Printer className="mr-2 h-4 w-4" />
          <span>Imprimir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

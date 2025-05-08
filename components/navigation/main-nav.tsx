"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, Users, UserCheck, Calendar, FileText, BarChart3, UserPlus } from "lucide-react"

// Definición de los elementos de navegación
const navItems = [
  {
    title: "Gestión de Estudiantes",
    href: "/students",
    icon: <Users className="h-5 w-5" />,
    module: "students",
  },
  {
    title: "Gestión Académica",
    href: "/academic",
    icon: <BookOpen className="h-5 w-5" />,
    module: "subjects",
  },
  {
    title: "Portal Docente",
    href: "/teachers",
    icon: <UserCheck className="h-5 w-5" />,
    module: "professors",
  },
  {
    title: "Calendario Académico",
    href: "/calendar",
    icon: <Calendar className="h-5 w-5" />,
    module: "periods",
  },
  {
    title: "Reportes",
    href: "/reports",
    icon: <FileText className="h-5 w-5" />,
    module: "reports",
  },
  {
    title: "Estadísticas",
    href: "/statistics",
    icon: <BarChart3 className="h-5 w-5" />,
    module: "statistics",
  },
  {
    title: "Aspirantes",
    href: "/aspirants",
    icon: <UserPlus className="h-5 w-5" />,
    module: "aspirants",
  },
]

export function MainNav() {
  const pathname = usePathname()
  const { hasPermission } = useAuth()

  // Filtrar los elementos de navegación según los permisos del usuario
  const filteredNavItems = navItems.filter((item) => hasPermission(item.module, "view"))

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 overflow-x-auto pb-2">
      {filteredNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
            pathname === item.href || pathname.startsWith(`${item.href}/`) ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.icon}
          <span className="ml-2">{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}

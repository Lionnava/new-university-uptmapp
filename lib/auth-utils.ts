// Definición de roles y permisos
export type UserRole = "estudiante" | "profesor" | "administrativo"

export interface Permission {
  module: string
  actions: ("view" | "create" | "edit" | "delete")[]
}

// Definición de permisos por rol
export const rolePermissions: Record<UserRole, Permission[]> = {
  estudiante: [
    { module: "profile", actions: ["view", "edit"] },
    { module: "enrollment", actions: ["view"] },
    { module: "grades", actions: ["view"] },
    { module: "schedule", actions: ["view"] },
    { module: "documents", actions: ["view", "create"] },
  ],
  profesor: [
    { module: "profile", actions: ["view", "edit"] },
    { module: "students", actions: ["view"] },
    { module: "grades", actions: ["view", "create", "edit"] },
    { module: "sections", actions: ["view"] },
    { module: "schedule", actions: ["view"] },
    { module: "documents", actions: ["view", "create"] },
  ],
  administrativo: [
    { module: "profile", actions: ["view", "edit"] },
    { module: "students", actions: ["view", "create", "edit", "delete"] },
    { module: "professors", actions: ["view", "create", "edit", "delete"] },
    { module: "subjects", actions: ["view", "create", "edit", "delete"] },
    { module: "sections", actions: ["view", "create", "edit", "delete"] },
    { module: "periods", actions: ["view", "create", "edit", "delete"] },
    { module: "trajectories", actions: ["view", "create", "edit", "delete"] },
    { module: "enrollments", actions: ["view", "create", "edit", "delete"] },
    { module: "grades", actions: ["view", "create", "edit", "delete"] },
    { module: "documents", actions: ["view", "create", "edit", "delete"] },
    { module: "reports", actions: ["view", "create"] },
    { module: "statistics", actions: ["view"] },
  ],
}

// Función para verificar si un usuario tiene permiso para una acción específica
export function hasPermission(
  role: UserRole | undefined,
  module: string,
  action: "view" | "create" | "edit" | "delete",
): boolean {
  if (!role) return false

  const permissions = rolePermissions[role]
  if (!permissions) return false

  const modulePermission = permissions.find((p) => p.module === module)
  if (!modulePermission) return false

  return modulePermission.actions.includes(action)
}

// Función para obtener todos los módulos a los que un usuario tiene acceso
export function getAccessibleModules(role: UserRole | undefined): string[] {
  if (!role) return []

  const permissions = rolePermissions[role]
  if (!permissions) return []

  return permissions.map((p) => p.module)
}

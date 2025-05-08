# Sistema de Gestión Universitaria

Sistema integral para la gestión académica universitaria, incluyendo registro de estudiantes, gestión académica, portal docente, calendario académico, reportes y estadísticas.

## Requisitos

- Node.js 18.0.0 o superior
- PostgreSQL 14.0 o superior
- NPM 8.0.0 o superior

## Instalación

1. Clonar el repositorio:
   \`\`\`bash
   git clone https://github.com/tu-usuario/sistema-gestion-universitaria.git
   cd sistema-gestion-universitaria
   \`\`\`

2. Instalar dependencias:
   \`\`\`bash
   npm install
   \`\`\`

3. Configurar variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Actualiza las variables con tus configuraciones

4. Ejecutar migraciones de base de datos:
   \`\`\`bash
   npx prisma migrate deploy
   \`\`\`

5. Cargar datos iniciales (opcional):
   \`\`\`bash
   npm run db:seed
   \`\`\`

## Desarrollo

Para ejecutar el proyecto en modo desarrollo:

\`\`\`bash
npm run dev
\`\`\`

## Producción

Para preparar y desplegar el proyecto en producción:

1. Verificar configuración de producción:
   \`\`\`bash
   npm run verify
   \`\`\`

2. Generar build de producción:
   \`\`\`bash
   npm run build
   \`\`\`

3. Iniciar servidor en modo producción:
   \`\`\`bash
   npm run start
   \`\`\`

Alternativamente, puedes usar el script de despliegue a producción:

\`\`\`bash
npm run prepare-production
\`\`\`

## Estructura del Proyecto

- `/app`: Páginas y rutas de la aplicación (Next.js App Router)
- `/components`: Componentes reutilizables
- `/contexts`: Contextos de React (autenticación, etc.)
- `/lib`: Utilidades y servicios
- `/prisma`: Esquema de base de datos y migraciones
- `/public`: Archivos estáticos
- `/scripts`: Scripts de utilidad

## Características Principales

- Gestión de estudiantes
- Gestión académica (materias, secciones)
- Portal docente
- Calendario académico
- Reportes y documentos
- Estadísticas
- Gestión de aspirantes

## Credenciales de Prueba

- **Administrador**: admin@universidad.edu / Admin123!
- **Profesor**: profesor@universidad.edu / Profesor123!
- **Estudiante**: estudiante@universidad.edu / Estudiante123!

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

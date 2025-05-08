# Pruebas de Estabilidad y Funcionalidad del Sistema Universitario

Este directorio contiene scripts para verificar la estabilidad y funcionalidad del sistema universitario. Estas pruebas ayudan a identificar problemas antes de la implementación en producción.

## Requisitos Previos

Antes de ejecutar las pruebas, asegúrese de que:

1. La base de datos está configurada y accesible
2. Las variables de entorno están configuradas correctamente
3. Todas las dependencias están instaladas

## Cómo Ejecutar las Pruebas

### Ejecutar Todas las Pruebas

Para ejecutar todas las pruebas de una vez:

\`\`\`bash
npm run test:all
\`\`\`

Este comando ejecutará el script `run-all-tests.ts` que coordina la ejecución de todas las pruebas individuales.

### Ejecutar Pruebas Individuales

También puede ejecutar pruebas individuales según sus necesidades:

\`\`\`bash
# Prueba de autenticación
npm run test:auth

# Prueba de operaciones CRUD
npm run test:crud

# Prueba de exportación de documentos
npm run test:export

# Prueba de integración con base de datos
npm run test:db

# Prueba de navegación y enlaces (debe ejecutarse en un navegador)
npm run test:navigation

# Prueba de rendimiento
npm run test:performance

# Prueba de integridad del sistema
npm run test:integrity
\`\`\`

## Interpretación de Resultados

Cada script de prueba genera un informe detallado con los resultados. Preste atención a:

- ✅ Indica que una prueba ha pasado correctamente
- ❌ Indica que una prueba ha fallado y requiere atención

## Solución de Problemas Comunes

### Problemas de Conexión a la Base de Datos

Si las pruebas de base de datos fallan:

1. Verifique que las variables de entorno de conexión a la base de datos sean correctas
2. Asegúrese de que la base de datos esté en funcionamiento
3. Verifique que el esquema de la base de datos esté actualizado con `npx prisma db push`

### Problemas de Autenticación

Si las pruebas de autenticación fallan:

1. Verifique que los usuarios de prueba existan en la base de datos
2. Asegúrese de que el middleware de autenticación esté configurado correctamente
3. Verifique que las rutas públicas estén correctamente definidas

### Problemas de Exportación de Documentos

Si las pruebas de exportación fallan:

1. Asegúrese de que todas las dependencias relacionadas estén instaladas
2. Verifique que los formatos de datos sean correctos
3. Compruebe los permisos de escritura en el directorio de salida

## Contacto

Si encuentra problemas persistentes o necesita ayuda adicional, contacte al equipo de desarrollo.
\`\`\`

## 10. Configuración de Scripts en package.json

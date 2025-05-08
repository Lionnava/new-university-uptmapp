/**
 * Prueba de integración con base de datos
 * Este script verifica la conexión y operaciones con la base de datos
 */

import { prisma } from "../lib/prisma"

async function testDatabaseConnection() {
  console.log("🧪 INICIANDO PRUEBAS DE INTEGRACIÓN CON BASE DE DATOS")
  console.log("===================================================")

  try {
    // Prueba 1: Verificar conexión a la base de datos
    console.log("Prueba 1: Verificar conexión a la base de datos")
    await prisma.$connect()
    console.log("✅ Conexión exitosa a la base de datos")

    // Prueba 2: Contar registros en tablas principales
    console.log("\nPrueba 2: Contar registros en tablas principales")

    const userCount = await prisma.user.count()
    console.log(`   Usuarios: ${userCount}`)

    const studentCount = await prisma.student.count()
    console.log(`   Estudiantes: ${studentCount}`)

    const professorCount = await prisma.professor.count()
    console.log(`   Profesores: ${professorCount}`)

    const subjectCount = await prisma.subject.count()
    console.log(`   Materias: ${subjectCount}`)

    const sectionCount = await prisma.section.count()
    console.log(`   Secciones: ${sectionCount}`)

    const periodCount = await prisma.period.count()
    console.log(`   Períodos: ${periodCount}`)

    const enrollmentCount = await prisma.enrollment.count()
    console.log(`   Inscripciones: ${enrollmentCount}`)

    const gradeCount = await prisma.grade.count()
    console.log(`   Calificaciones: ${gradeCount}`)

    const aspirantCount = await prisma.aspirant.count()
    console.log(`   Aspirantes: ${aspirantCount}`)

    // Prueba 3: Realizar una consulta compleja
    console.log("\nPrueba 3: Realizar una consulta compleja (estudiantes con sus carreras)")
    const studentsWithCareers = await prisma.student.findMany({
      take: 5,
      include: {
        user: true,
        career: true,
      },
    })

    console.log(`   Obtenidos ${studentsWithCareers.length} estudiantes con sus datos de carrera`)
    if (studentsWithCareers.length > 0) {
      const sample = studentsWithCareers[0]
      console.log(
        `   Muestra: Estudiante ${sample.user.firstName} ${sample.user.lastName}, Carrera: ${sample.career?.name || "No asignada"}`,
      )
    }

    // Prueba 4: Verificar integridad referencial
    console.log("\nPrueba 4: Verificar integridad referencial (profesores y sus departamentos)")
    const professorsWithDepartments = await prisma.professor.findMany({
      take: 5,
      include: {
        user: true,
        department: true,
      },
    })

    console.log(`   Obtenidos ${professorsWithDepartments.length} profesores con sus departamentos`)
    if (professorsWithDepartments.length > 0) {
      const sample = professorsWithDepartments[0]
      console.log(
        `   Muestra: Profesor ${sample.user.firstName} ${sample.user.lastName}, Departamento: ${sample.department?.name || "No asignado"}`,
      )
    }

    // Prueba 5: Verificar transacciones
    console.log("\nPrueba 5: Verificar transacciones")

    // Crear una transacción de prueba
    const testEmail = `test.transaction.${Date.now()}@test.com`

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Crear un usuario temporal
        const tempUser = await tx.user.create({
          data: {
            email: testEmail,
            password: "password_hash",
            firstName: "Usuario",
            lastName: "Temporal",
            cedula: "V-00000000",
            role: "estudiante",
          },
        })

        console.log(`   Usuario temporal creado con ID: ${tempUser.id}`)

        // Eliminar el usuario temporal (dentro de la misma transacción)
        await tx.user.delete({
          where: { id: tempUser.id },
        })

        console.log(`   Usuario temporal eliminado correctamente`)

        return { success: true }
      })

      console.log(`✅ Transacción completada con éxito: ${result.success}`)
    } catch (error) {
      console.error(`❌ Error en la transacción: ${error}`)
    }

    // Verificar que el usuario temporal no existe
    const tempUser = await prisma.user.findFirst({
      where: { email: testEmail },
    })

    console.log(`   Usuario temporal existe después de la transacción: ${tempUser ? "SÍ (ERROR)" : "NO (CORRECTO)"}`)
  } catch (error) {
    console.error(`❌ Error en las pruebas de base de datos: ${error}`)
  } finally {
    // Cerrar la conexión
    await prisma.$disconnect()
    console.log("\n✅ PRUEBAS DE BASE DE DATOS COMPLETADAS")
  }
}

// Ejecutar las pruebas
testDatabaseConnection().catch(console.error)

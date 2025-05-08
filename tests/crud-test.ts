/**
 * Prueba de operaciones CRUD
 * Este script verifica las operaciones Create, Read, Update, Delete para las diferentes entidades
 */

import {
  saveStudent,
  getAllStudents,
  saveProfessor,
  getAllProfessors,
  saveAspirant,
  getAllAspirants,
  saveSubject,
  getAllSubjects,
} from "../lib/data-service"

async function testCrudOperations() {
  console.log("🧪 INICIANDO PRUEBAS DE OPERACIONES CRUD")
  console.log("========================================")

  // Prueba 1: Crear y obtener estudiante
  try {
    console.log("Prueba 1: Crear y obtener estudiante")

    // Datos de prueba
    const studentData = {
      firstName: "Estudiante",
      lastName: "Prueba",
      cedula: "V-12345678",
      email: `estudiante.prueba.${Date.now()}@test.com`,
      phone: "+58 412 1234567",
      gender: "masculino",
      career: "informatica",
      status: "activo",
    }

    // Crear estudiante
    console.log("   Creando estudiante...")
    const createResult = await saveStudent(studentData)
    console.log(`   Resultado: ${createResult.success ? "ÉXITO" : "FALLO"}`)

    if (createResult.success) {
      console.log(`   Estudiante creado con ID: ${createResult.data.id}`)

      // Obtener todos los estudiantes
      console.log("   Obteniendo lista de estudiantes...")
      const getResult = await getAllStudents()
      console.log(`   Resultado: ${getResult.success ? "ÉXITO" : "FALLO"}`)
      console.log(`   Número de estudiantes: ${getResult.data?.length || 0}`)

      // Verificar si el estudiante creado está en la lista
      const found = getResult.data?.some((student) => student.user.email === studentData.email)
      console.log(`   Estudiante encontrado en la lista: ${found ? "SÍ" : "NO"}`)
    } else {
      console.error(`   Error: ${createResult.error}`)
    }
  } catch (error) {
    console.error(`❌ Error en prueba 1: ${error}`)
  }

  // Prueba 2: Crear y obtener profesor
  try {
    console.log("\nPrueba 2: Crear y obtener profesor")

    // Datos de prueba
    const professorData = {
      firstName: "Profesor",
      lastName: "Prueba",
      cedula: "V-87654321",
      email: `profesor.prueba.${Date.now()}@test.com`,
      phone: "+58 412 7654321",
      department: "informatica",
      education: "Doctorado",
      specialization: "Inteligencia Artificial",
      contractType: "tiempo_completo",
      status: "activo",
    }

    // Crear profesor
    console.log("   Creando profesor...")
    const createResult = await saveProfessor(professorData)
    console.log(`   Resultado: ${createResult.success ? "ÉXITO" : "FALLO"}`)

    if (createResult.success) {
      console.log(`   Profesor creado con ID: ${createResult.data.id}`)

      // Obtener todos los profesores
      console.log("   Obteniendo lista de profesores...")
      const getResult = await getAllProfessors()
      console.log(`   Resultado: ${getResult.success ? "ÉXITO" : "FALLO"}`)
      console.log(`   Número de profesores: ${getResult.data?.length || 0}`)

      // Verificar si el profesor creado está en la lista
      const found = getResult.data?.some((professor) => professor.user.email === professorData.email)
      console.log(`   Profesor encontrado en la lista: ${found ? "SÍ" : "NO"}`)
    } else {
      console.error(`   Error: ${createResult.error}`)
    }
  } catch (error) {
    console.error(`❌ Error en prueba 2: ${error}`)
  }

  // Prueba 3: Crear y obtener aspirante
  try {
    console.log("\nPrueba 3: Crear y obtener aspirante")

    // Datos de prueba
    const aspirantData = {
      firstName: "Aspirante",
      lastName: "Prueba",
      cedula: "V-23456789",
      email: `aspirante.prueba.${Date.now()}@test.com`,
      phone: "+58 412 2345678",
      desiredCareer: "informatica",
      status: "pendiente",
      highSchool: "Liceo Prueba",
      graduationYear: "2023",
    }

    // Crear aspirante
    console.log("   Creando aspirante...")
    const createResult = await saveAspirant(aspirantData)
    console.log(`   Resultado: ${createResult.success ? "ÉXITO" : "FALLO"}`)

    if (createResult.success) {
      console.log(`   Aspirante creado con ID: ${createResult.data.id}`)

      // Obtener todos los aspirantes
      console.log("   Obteniendo lista de aspirantes...")
      const getResult = await getAllAspirants()
      console.log(`   Resultado: ${getResult.success ? "ÉXITO" : "FALLO"}`)
      console.log(`   Número de aspirantes: ${getResult.data?.length || 0}`)

      // Verificar si el aspirante creado está en la lista
      const found = getResult.data?.some((aspirant) => aspirant.user.email === aspirantData.email)
      console.log(`   Aspirante encontrado en la lista: ${found ? "SÍ" : "NO"}`)
    } else {
      console.error(`   Error: ${createResult.error}`)
    }
  } catch (error) {
    console.error(`❌ Error en prueba 3: ${error}`)
  }

  // Prueba 4: Crear y obtener materia
  try {
    console.log("\nPrueba 4: Crear y obtener materia")

    // Datos de prueba
    const subjectData = {
      code: `MAT-${Date.now().toString().substring(7)}`,
      name: "Materia de Prueba",
      description: "Descripción de la materia de prueba",
      credits: 4,
      department: "informatica",
      isElective: false,
      isActive: true,
    }

    // Crear materia
    console.log("   Creando materia...")
    const createResult = await saveSubject(subjectData)
    console.log(`   Resultado: ${createResult.success ? "ÉXITO" : "FALLO"}`)

    if (createResult.success) {
      console.log(`   Materia creada con código: ${createResult.data.code}`)

      // Obtener todas las materias
      console.log("   Obteniendo lista de materias...")
      const getResult = await getAllSubjects()
      console.log(`   Resultado: ${getResult.success ? "ÉXITO" : "FALLO"}`)
      console.log(`   Número de materias: ${getResult.data?.length || 0}`)

      // Verificar si la materia creada está en la lista
      const found = getResult.data?.some((subject) => subject.code === subjectData.code)
      console.log(`   Materia encontrada en la lista: ${found ? "SÍ" : "NO"}`)
    } else {
      console.error(`   Error: ${createResult.error}`)
    }
  } catch (error) {
    console.error(`❌ Error en prueba 4: ${error}`)
  }

  console.log("\n✅ PRUEBAS DE OPERACIONES CRUD COMPLETADAS")
}

// Ejecutar las pruebas
testCrudOperations().catch(console.error)

import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Iniciando la carga de datos de ejemplo...")

  // Crear departamentos
  const informaticaDept = await prisma.department.create({
    data: {
      code: "INF",
      name: "Informática",
      description: "Departamento de Ingeniería Informática",
    },
  })

  const matematicasDept = await prisma.department.create({
    data: {
      code: "MAT",
      name: "Matemáticas",
      description: "Departamento de Matemáticas",
    },
  })

  const administracionDept = await prisma.department.create({
    data: {
      code: "ADM",
      name: "Administración",
      description: "Departamento de Administración",
    },
  })

  const contaduriaDept = await prisma.department.create({
    data: {
      code: "CON",
      name: "Contaduría",
      description: "Departamento de Contaduría",
    },
  })

  // Crear carreras
  const informaticaCareer = await prisma.career.create({
    data: {
      code: "ING-INF",
      name: "Ingeniería Informática",
      description: "Carrera de Ingeniería Informática",
      departmentId: informaticaDept.id,
      credits: 180,
      duration: 10,
    },
  })

  const administracionCareer = await prisma.career.create({
    data: {
      code: "ADM-EMP",
      name: "Administración",
      description: "Carrera de Administración de Empresas",
      departmentId: administracionDept.id,
      credits: 160,
      duration: 8,
    },
  })

  const contaduriaCareer = await prisma.career.create({
    data: {
      code: "CON-PUB",
      name: "Contaduría",
      description: "Carrera de Contaduría Pública",
      departmentId: contaduriaDept.id,
      credits: 160,
      duration: 8,
    },
  })

  // Crear materias
  const introProgramacion = await prisma.subject.create({
    data: {
      code: "INF-101",
      name: "Introducción a la Programación",
      description: "Fundamentos de programación y algoritmos",
      credits: 4,
      departmentId: informaticaDept.id,
      careerId: informaticaCareer.id,
    },
  })

  const calculo = await prisma.subject.create({
    data: {
      code: "MAT-201",
      name: "Cálculo I",
      description: "Cálculo diferencial e integral de una variable",
      credits: 4,
      departmentId: matematicasDept.id,
      careerId: informaticaCareer.id,
    },
  })

  const administracionEmpresas = await prisma.subject.create({
    data: {
      code: "ADM-301",
      name: "Administración de Empresas",
      description: "Fundamentos de administración empresarial",
      credits: 3,
      departmentId: administracionDept.id,
      careerId: administracionCareer.id,
    },
  })

  // Crear períodos académicos
  const periodo1 = await prisma.period.create({
    data: {
      code: "2023-T1",
      name: "Trimestre I 2023",
      year: 2023,
      trimester: "1",
      startDate: new Date("2023-01-15"),
      endDate: new Date("2023-04-15"),
      enrollmentStartDate: new Date("2023-01-01"),
      enrollmentEndDate: new Date("2023-01-10"),
      isActive: false,
    },
  })

  const periodo2 = await prisma.period.create({
    data: {
      code: "2023-T2",
      name: "Trimestre II 2023",
      year: 2023,
      trimester: "2",
      startDate: new Date("2023-05-01"),
      endDate: new Date("2023-08-01"),
      enrollmentStartDate: new Date("2023-04-15"),
      enrollmentEndDate: new Date("2023-04-25"),
      isActive: false,
    },
  })

  const periodo3 = await prisma.period.create({
    data: {
      code: "2023-T3",
      name: "Trimestre III 2023",
      year: 2023,
      trimester: "3",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2023-12-15"),
      enrollmentStartDate: new Date("2023-08-15"),
      enrollmentEndDate: new Date("2023-08-25"),
      isActive: true,
    },
  })

  // Crear trayecto académico
  await prisma.trajectory.create({
    data: {
      code: "TRAY-2023-2024",
      name: "Año Académico 2023-2024",
      academicYear: "2023-2024",
      description: "Trayecto académico regular para el año 2023-2024",
      firstPeriodId: periodo1.id,
      secondPeriodId: periodo2.id,
      thirdPeriodId: periodo3.id,
      isActive: true,
    },
  })

  // Crear usuarios
  // Admin
  const adminPassword = await hash("Admin123!", 10)
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@universidad.edu",
      password: adminPassword,
      firstName: "Administrador",
      lastName: "Sistema",
      cedula: "V-12345678",
      gender: "masculino",
      phone: "+58 412 1234567",
      address: "Ciudad Universitaria",
      role: "administrativo",
    },
  })

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
      adminId: "ADMIN-001",
      position: "Administrador del Sistema",
      department: "Tecnología",
      permissions: JSON.stringify(["all"]),
    },
  })

  // Profesor
  const professorPassword = await hash("Profesor123!", 10)
  const professorUser = await prisma.user.create({
    data: {
      email: "profesor@universidad.edu",
      password: professorPassword,
      firstName: "Juan",
      lastName: "Pérez",
      cedula: "V-23456789",
      gender: "masculino",
      phone: "+58 412 2345678",
      address: "Av. Universidad",
      role: "profesor",
    },
  })

  await prisma.professor.create({
    data: {
      userId: professorUser.id,
      professorId: "PROF-001",
      departmentId: informaticaDept.id,
      education: "Doctor en Informática",
      specialization: "Inteligencia Artificial",
      contractType: "tiempo_completo",
      status: "activo",
      hireDate: new Date("2020-01-15"),
    },
  })

  // Estudiante
  const studentPassword = await hash("Estudiante123!", 10)
  const studentUser = await prisma.user.create({
    data: {
      email: "estudiante@universidad.edu",
      password: studentPassword,
      firstName: "Ana María",
      lastName: "Rodríguez",
      cedula: "V-34567890",
      birthDate: new Date("2000-05-15"),
      gender: "femenino",
      phone: "+58 412 3456789",
      address: "Calle Universidad",
      role: "estudiante",
    },
  })

  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      studentId: "EST-001",
      careerId: informaticaCareer.id,
      status: "activo",
      admissionDate: new Date("2021-09-01"),
    },
  })

  // Crear secciones
  const section1 = await prisma.section.create({
    data: {
      code: "SEC-001",
      subjectId: introProgramacion.id,
      professorId: (await prisma.professor.findFirst())!.id,
      periodId: periodo3.id,
      schedule: "Lun-Mie 8:00-10:00",
      classroom: "A-101",
      capacity: 30,
    },
  })

  // Crear inscripción
  const enrollment = await prisma.enrollment.create({
    data: {
      studentId: student.id,
      sectionId: section1.id,
      periodId: periodo3.id,
      status: "activa",
    },
  })

  // Crear calificaciones
  await prisma.grade.create({
    data: {
      studentId: student.id,
      sectionId: section1.id,
      enrollmentId: enrollment.id,
      eval1: 18,
      eval2: 17,
      eval3: 19,
      finalGrade: 18.2,
    },
  })

  console.log("Datos de ejemplo cargados exitosamente")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

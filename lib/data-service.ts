import { prisma } from "./prisma"
import { hash } from "bcryptjs"

// Función para guardar un estudiante
export async function saveStudent(studentData: any) {
  try {
    // Si ya existe un usuario con este email, actualizarlo
    if (studentData.id) {
      const updatedStudent = await prisma.student.update({
        where: { id: studentData.id },
        data: {
          status: studentData.status,
          careerId: studentData.careerId,
          user: {
            update: {
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              cedula: studentData.cedula,
              birthDate: studentData.birthDate ? new Date(studentData.birthDate) : undefined,
              gender: studentData.gender,
              email: studentData.email,
              phone: studentData.phone,
              address: studentData.address,
            },
          },
        },
        include: {
          user: true,
          career: true,
        },
      })
      return { success: true, data: updatedStudent }
    }

    // Verificar si ya existe un usuario con este email o cédula
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: studentData.email }, { cedula: studentData.cedula }],
      },
    })

    if (existingUser) {
      return {
        success: false,
        error: "Ya existe un usuario con este correo electrónico o cédula.",
      }
    }

    // Crear un nuevo usuario y estudiante
    const hashedPassword = await hash(studentData.password || "Estudiante123!", 10) // Contraseña por defecto
    const newUser = await prisma.user.create({
      data: {
        email: studentData.email,
        password: hashedPassword,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        cedula: studentData.cedula,
        birthDate: studentData.birthDate ? new Date(studentData.birthDate) : undefined,
        gender: studentData.gender,
        phone: studentData.phone,
        address: studentData.address,
        role: "estudiante",
      },
    })

    // Obtener el ID de la carrera
    let careerId = studentData.careerId
    if (!careerId) {
      // Si no se proporciona un ID de carrera, buscar por el nombre de la carrera
      const career = await prisma.career.findFirst({
        where: {
          name: {
            contains: studentData.career,
            mode: "insensitive",
          },
        },
      })
      careerId = career?.id
    }

    if (!careerId) {
      // Si aún no hay ID de carrera, usar la primera carrera disponible
      const firstCareer = await prisma.career.findFirst()
      careerId = firstCareer?.id
    }

    // Generar un ID de estudiante único
    const studentCount = await prisma.student.count()
    const studentId = `EST-${(studentCount + 1).toString().padStart(3, "0")}`

    // Crear el estudiante
    const newStudent = await prisma.student.create({
      data: {
        userId: newUser.id,
        studentId,
        careerId,
        status: studentData.status || "activo",
        admissionDate: studentData.admissionDate ? new Date(studentData.admissionDate) : new Date(),
      },
      include: {
        user: true,
        career: true,
      },
    })

    return { success: true, data: newStudent }
  } catch (error) {
    console.error("Error al guardar estudiante:", error)
    return { success: false, error: "Error al guardar los datos del estudiante." }
  }
}

// Función para guardar un profesor
export async function saveProfessor(professorData: any) {
  try {
    // Si ya existe un profesor con este ID, actualizarlo
    if (professorData.id) {
      const updatedProfessor = await prisma.professor.update({
        where: { id: professorData.id },
        data: {
          departmentId: professorData.departmentId,
          education: professorData.education,
          specialization: professorData.specialization,
          contractType: professorData.contractType,
          status: professorData.status,
          user: {
            update: {
              firstName: professorData.firstName,
              lastName: professorData.lastName,
              cedula: professorData.cedula,
              email: professorData.email,
              phone: professorData.phone,
            },
          },
        },
        include: {
          user: true,
          department: true,
        },
      })
      return { success: true, data: updatedProfessor }
    }

    // Verificar si ya existe un usuario con este email o cédula
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: professorData.email }, { cedula: professorData.cedula }],
      },
    })

    if (existingUser) {
      return {
        success: false,
        error: "Ya existe un usuario con este correo electrónico o cédula.",
      }
    }

    // Crear un nuevo usuario y profesor
    const hashedPassword = await hash(professorData.password || "Profesor123!", 10) // Contraseña por defecto
    const newUser = await prisma.user.create({
      data: {
        email: professorData.email,
        password: hashedPassword,
        firstName: professorData.firstName,
        lastName: professorData.lastName,
        cedula: professorData.cedula,
        gender: professorData.gender || "masculino",
        phone: professorData.phone,
        role: "profesor",
      },
    })

    // Obtener el ID del departamento
    let departmentId = professorData.departmentId
    if (!departmentId) {
      // Si no se proporciona un ID de departamento, buscar por el nombre del departamento
      const department = await prisma.department.findFirst({
        where: {
          name: {
            contains: professorData.department,
            mode: "insensitive",
          },
        },
      })
      departmentId = department?.id
    }

    if (!departmentId) {
      // Si aún no hay ID de departamento, usar el primer departamento disponible
      const firstDepartment = await prisma.department.findFirst()
      departmentId = firstDepartment?.id
    }

    // Generar un ID de profesor único
    const professorCount = await prisma.professor.count()
    const professorId = `PROF-${(professorCount + 1).toString().padStart(3, "0")}`

    // Crear el profesor
    const newProfessor = await prisma.professor.create({
      data: {
        userId: newUser.id,
        professorId,
        departmentId,
        education: professorData.education,
        specialization: professorData.specialization,
        contractType: professorData.contractType || "tiempo_completo",
        status: professorData.status || "activo",
        hireDate: professorData.hireDate
          ? new Date(professorData.hireDate)
          : new Date(new Date().getFullYear(), Number.parseInt(professorData.hireDateMonth || "0"), 1),
      },
      include: {
        user: true,
        department: true,
      },
    })

    return { success: true, data: newProfessor }
  } catch (error) {
    console.error("Error al guardar profesor:", error)
    return { success: false, error: "Error al guardar los datos del profesor." }
  }
}

// Función para guardar un aspirante
export async function saveAspirant(aspirantData: any) {
  try {
    // Si ya existe un aspirante con este ID, actualizarlo
    if (aspirantData.id) {
      const updatedAspirant = await prisma.aspirant.update({
        where: { id: aspirantData.id },
        data: {
          desiredCareerId: aspirantData.desiredCareerId,
          status: aspirantData.status,
          highSchool: aspirantData.highSchool,
          graduationYear: aspirantData.graduationYear ? Number.parseInt(aspirantData.graduationYear) : null,
          averageGrade: aspirantData.averageGrade ? Number.parseFloat(aspirantData.averageGrade) : null,
          interviewDate: aspirantData.interviewDate ? new Date(aspirantData.interviewDate) : null,
          interviewNotes: aspirantData.interviewNotes,
          documents: aspirantData.documents,
          user: {
            update: {
              firstName: aspirantData.firstName,
              lastName: aspirantData.lastName,
              cedula: aspirantData.cedula,
              birthDate: aspirantData.birthDate ? new Date(aspirantData.birthDate) : undefined,
              gender: aspirantData.gender,
              email: aspirantData.email,
              phone: aspirantData.phone,
              address: aspirantData.address,
            },
          },
        },
        include: {
          user: true,
          desiredCareer: true,
        },
      })
      return { success: true, data: updatedAspirant }
    }

    // Verificar si ya existe un usuario con este email o cédula
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: aspirantData.email }, { cedula: aspirantData.cedula }],
      },
    })

    if (existingUser) {
      return {
        success: false,
        error: "Ya existe un usuario con este correo electrónico o cédula.",
      }
    }

    // Crear un nuevo usuario y aspirante
    const hashedPassword = await hash(aspirantData.password || "Aspirante123!", 10) // Contraseña por defecto
    const newUser = await prisma.user.create({
      data: {
        email: aspirantData.email,
        password: hashedPassword,
        firstName: aspirantData.firstName,
        lastName: aspirantData.lastName,
        cedula: aspirantData.cedula,
        birthDate: aspirantData.birthDate ? new Date(aspirantData.birthDate) : undefined,
        gender: aspirantData.gender,
        phone: aspirantData.phone,
        address: aspirantData.address,
        role: "aspirante",
      },
    })

    // Obtener el ID de la carrera deseada
    let desiredCareerId = aspirantData.desiredCareerId
    if (!desiredCareerId && aspirantData.desiredCareer) {
      // Si no se proporciona un ID de carrera, buscar por el nombre de la carrera
      const career = await prisma.career.findFirst({
        where: {
          name: {
            contains: aspirantData.desiredCareer,
            mode: "insensitive",
          },
        },
      })
      desiredCareerId = career?.id
    }

    // Generar un ID de aspirante único
    const aspirantCount = await prisma.aspirant.count()
    const aspirantId = `ASP-${(aspirantCount + 1).toString().padStart(3, "0")}`

    // Crear el aspirante
    const newAspirant = await prisma.aspirant.create({
      data: {
        userId: newUser.id,
        aspirantId,
        desiredCareerId: desiredCareerId || null,
        status: aspirantData.status || "pendiente",
        highSchool: aspirantData.highSchool,
        graduationYear: aspirantData.graduationYear ? Number.parseInt(aspirantData.graduationYear) : null,
        averageGrade: aspirantData.averageGrade ? Number.parseFloat(aspirantData.averageGrade) : null,
        interviewDate: aspirantData.interviewDate ? new Date(aspirantData.interviewDate) : null,
        interviewNotes: aspirantData.interviewNotes,
        documents: aspirantData.documents,
      },
      include: {
        user: true,
        desiredCareer: true,
      },
    })

    return { success: true, data: newAspirant }
  } catch (error) {
    console.error("Error al guardar aspirante:", error)
    return { success: false, error: "Error al guardar los datos del aspirante." }
  }
}

// Función para guardar una materia
export async function saveSubject(subjectData: any) {
  try {
    // Si ya existe una materia con este código, actualizarla
    if (subjectData.code) {
      const existingSubject = await prisma.subject.findUnique({
        where: { code: subjectData.code },
      })

      if (existingSubject) {
        const updatedSubject = await prisma.subject.update({
          where: { code: subjectData.code },
          data: {
            name: subjectData.name,
            description: subjectData.description,
            credits: subjectData.credits,
            departmentId: subjectData.departmentId,
            careerId: subjectData.careerId,
            prerequisites: subjectData.prerequisites,
            isElective: subjectData.isElective,
            isActive: subjectData.isActive,
          },
          include: {
            department: true,
            career: true,
          },
        })
        return { success: true, data: updatedSubject }
      }
    }

    // Obtener el ID del departamento
    let departmentId = subjectData.departmentId
    if (!departmentId) {
      // Si no se proporciona un ID de departamento, buscar por el nombre del departamento
      const department = await prisma.department.findFirst({
        where: {
          name: {
            contains: subjectData.department,
            mode: "insensitive",
          },
        },
      })
      departmentId = department?.id
    }

    if (!departmentId) {
      // Si aún no hay ID de departamento, usar el primer departamento disponible
      const firstDepartment = await prisma.department.findFirst()
      departmentId = firstDepartment?.id
    }

    // Obtener el ID de la carrera
    let careerId = subjectData.careerId
    if (!careerId) {
      // Si no se proporciona un ID de carrera, usar la primera carrera disponible
      const firstCareer = await prisma.career.findFirst()
      careerId = firstCareer?.id
    }

    // Crear la materia
    const newSubject = await prisma.subject.create({
      data: {
        code: subjectData.code,
        name: subjectData.name,
        description: subjectData.description || "",
        credits: subjectData.credits,
        departmentId,
        careerId,
        prerequisites: subjectData.prerequisites || "",
        isElective: subjectData.isElective || false,
        isActive: subjectData.isActive !== undefined ? subjectData.isActive : true,
      },
      include: {
        department: true,
        career: true,
      },
    })

    return { success: true, data: newSubject }
  } catch (error) {
    console.error("Error al guardar materia:", error)
    return { success: false, error: "Error al guardar los datos de la materia." }
  }
}

// Función para guardar una sección
export async function saveSection(sectionData: any) {
  try {
    // Si ya existe una sección con este código, actualizarla
    if (sectionData.code) {
      const existingSection = await prisma.section.findUnique({
        where: { code: sectionData.code },
      })

      if (existingSection) {
        const updatedSection = await prisma.section.update({
          where: { code: sectionData.code },
          data: {
            subjectId: sectionData.subjectId,
            professorId: sectionData.professorId,
            periodId: sectionData.periodId,
            schedule: sectionData.schedule,
            classroom: sectionData.classroom,
            capacity: sectionData.capacity,
          },
          include: {
            subject: true,
            professor: {
              include: {
                user: true,
              },
            },
            period: true,
          },
        })
        return { success: true, data: updatedSection }
      }
    }

    // Crear la sección
    const newSection = await prisma.section.create({
      data: {
        code: sectionData.code,
        subjectId: sectionData.subjectId,
        professorId: sectionData.professorId,
        periodId: sectionData.periodId,
        schedule: sectionData.schedule,
        classroom: sectionData.classroom,
        capacity: sectionData.capacity,
      },
      include: {
        subject: true,
        professor: {
          include: {
            user: true,
          },
        },
        period: true,
      },
    })

    return { success: true, data: newSection }
  } catch (error) {
    console.error("Error al guardar sección:", error)
    return { success: false, error: "Error al guardar los datos de la sección." }
  }
}

// Función para guardar un período académico
export async function savePeriod(periodData: any) {
  try {
    // Si ya existe un período con este código, actualizarlo
    if (periodData.code) {
      const existingPeriod = await prisma.period.findUnique({
        where: { code: periodData.code },
      })

      if (existingPeriod) {
        const updatedPeriod = await prisma.period.update({
          where: { code: periodData.code },
          data: {
            name: periodData.name,
            year: periodData.year,
            trimester: periodData.trimester,
            startDate: new Date(periodData.startDate),
            endDate: new Date(periodData.endDate),
            enrollmentStartDate: new Date(periodData.enrollmentStartDate),
            enrollmentEndDate: new Date(periodData.enrollmentEndDate),
            isActive: periodData.isActive,
          },
        })
        return { success: true, data: updatedPeriod }
      }
    }

    // Crear el período
    const newPeriod = await prisma.period.create({
      data: {
        code: periodData.code,
        name: periodData.name,
        year: periodData.year,
        trimester: periodData.trimester,
        startDate: new Date(periodData.startDate),
        endDate: new Date(periodData.endDate),
        enrollmentStartDate: new Date(periodData.enrollmentStartDate),
        enrollmentEndDate: new Date(periodData.enrollmentEndDate),
        isActive: periodData.isActive,
      },
    })

    return { success: true, data: newPeriod }
  } catch (error) {
    console.error("Error al guardar período:", error)
    return { success: false, error: "Error al guardar los datos del período académico." }
  }
}

// Función para guardar un trayecto académico
export async function saveTrajectory(trajectoryData: any) {
  try {
    // Si ya existe un trayecto con este código, actualizarlo
    if (trajectoryData.code) {
      const existingTrajectory = await prisma.trajectory.findUnique({
        where: { code: trajectoryData.code },
      })

      if (existingTrajectory) {
        const updatedTrajectory = await prisma.trajectory.update({
          where: { code: trajectoryData.code },
          data: {
            name: trajectoryData.name,
            academicYear: trajectoryData.academicYear,
            description: trajectoryData.description,
            firstPeriodId: trajectoryData.firstPeriodId,
            secondPeriodId: trajectoryData.secondPeriodId,
            thirdPeriodId: trajectoryData.thirdPeriodId,
            isActive: trajectoryData.isActive,
          },
        })
        return { success: true, data: updatedTrajectory }
      }
    }

    // Crear el trayecto
    const newTrajectory = await prisma.trajectory.create({
      data: {
        code: trajectoryData.code,
        name: trajectoryData.name,
        academicYear: trajectoryData.academicYear,
        description: trajectoryData.description || "",
        firstPeriodId: trajectoryData.firstPeriodId,
        secondPeriodId: trajectoryData.secondPeriodId,
        thirdPeriodId: trajectoryData.thirdPeriodId,
        isActive: trajectoryData.isActive,
      },
    })

    return { success: true, data: newTrajectory }
  } catch (error) {
    console.error("Error al guardar trayecto:", error)
    return { success: false, error: "Error al guardar los datos del trayecto académico." }
  }
}

// Función para guardar una inscripción
export async function saveEnrollment(enrollmentData: any) {
  try {
    // Verificar si ya existe una inscripción para este estudiante y sección
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: enrollmentData.studentId,
        sectionId: enrollmentData.sectionId,
        periodId: enrollmentData.periodId,
      },
    })

    if (existingEnrollment) {
      return {
        success: false,
        error: "El estudiante ya está inscrito en esta sección.",
      }
    }

    // Crear la inscripción
    const newEnrollment = await prisma.enrollment.create({
      data: {
        studentId: enrollmentData.studentId,
        sectionId: enrollmentData.sectionId,
        periodId: enrollmentData.periodId,
        status: enrollmentData.status || "activa",
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        section: {
          include: {
            subject: true,
          },
        },
        period: true,
      },
    })

    return { success: true, data: newEnrollment }
  } catch (error) {
    console.error("Error al guardar inscripción:", error)
    return { success: false, error: "Error al guardar los datos de la inscripción." }
  }
}

// Función para guardar calificaciones
export async function saveGrades(gradesData: any) {
  try {
    const { studentId, sectionId, enrollmentId, eval1, eval2, eval3, finalGrade, observations } = gradesData

    // Verificar si ya existen calificaciones para este estudiante y sección
    const existingGrade = await prisma.grade.findFirst({
      where: {
        studentId,
        sectionId,
        enrollmentId,
      },
    })

    if (existingGrade) {
      // Actualizar las calificaciones existentes
      const updatedGrade = await prisma.grade.update({
        where: { id: existingGrade.id },
        data: {
          eval1,
          eval2,
          eval3,
          finalGrade,
          observations,
        },
      })
      return { success: true, data: updatedGrade }
    }

    // Crear nuevas calificaciones
    const newGrade = await prisma.grade.create({
      data: {
        studentId,
        sectionId,
        enrollmentId,
        eval1,
        eval2,
        eval3,
        finalGrade,
        observations,
      },
    })

    return { success: true, data: newGrade }
  } catch (error) {
    console.error("Error al guardar calificaciones:", error)
    return { success: false, error: "Error al guardar las calificaciones." }
  }
}

// Función para guardar un documento
export async function saveDocument(documentData: any) {
  try {
    // Crear el documento
    const newDocument = await prisma.document.create({
      data: {
        studentId: documentData.studentId,
        type: documentData.type,
        title: documentData.title,
        content: documentData.content,
        format: documentData.format || "pdf",
        createdBy: documentData.createdBy,
        status: documentData.status || "emitido",
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    })

    return { success: true, data: newDocument }
  } catch (error) {
    console.error("Error al guardar documento:", error)
    return { success: false, error: "Error al guardar el documento." }
  }
}

// Función para guardar material de clase
export async function saveClassMaterial(materialData: any) {
  try {
    // Crear el material de clase
    const newMaterial = await prisma.classMaterial.create({
      data: {
        title: materialData.title,
        description: materialData.description || "",
        fileUrl: materialData.fileUrl,
        fileType: materialData.fileType,
        professorId: materialData.professorId,
        subjectId: materialData.subjectId,
        isPublic: materialData.isPublic !== undefined ? materialData.isPublic : true,
      },
      include: {
        professor: {
          include: {
            user: true,
          },
        },
        subject: true,
      },
    })

    return { success: true, data: newMaterial }
  } catch (error) {
    console.error("Error al guardar material de clase:", error)
    return { success: false, error: "Error al guardar el material de clase." }
  }
}

// Funciones de consulta

// Obtener todos los estudiantes
export async function getAllStudents(filters = {}) {
  try {
    const students = await prisma.student.findMany({
      where: filters,
      include: {
        user: true,
        career: true,
      },
      orderBy: {
        user: {
          lastName: "asc",
        },
      },
    })
    return { success: true, data: students }
  } catch (error) {
    console.error("Error al obtener estudiantes:", error)
    return { success: false, error: "Error al obtener los estudiantes." }
  }
}

// Obtener todos los profesores
export async function getAllProfessors(filters = {}) {
  try {
    const professors = await prisma.professor.findMany({
      where: filters,
      include: {
        user: true,
        department: true,
      },
      orderBy: {
        user: {
          lastName: "asc",
        },
      },
    })
    return { success: true, data: professors }
  } catch (error) {
    console.error("Error al obtener profesores:", error)
    return { success: false, error: "Error al obtener los profesores." }
  }
}

// Obtener todos los aspirantes
export async function getAllAspirants(filters = {}) {
  try {
    const aspirants = await prisma.aspirant.findMany({
      where: filters,
      include: {
        user: true,
        desiredCareer: true,
      },
      orderBy: {
        applicationDate: "desc",
      },
    })
    return { success: true, data: aspirants }
  } catch (error) {
    console.error("Error al obtener aspirantes:", error)
    return { success: false, error: "Error al obtener los aspirantes." }
  }
}

// Obtener todas las materias
export async function getAllSubjects(filters = {}) {
  try {
    const subjects = await prisma.subject.findMany({
      where: filters,
      include: {
        department: true,
        career: true,
      },
      orderBy: {
        code: "asc",
      },
    })
    return { success: true, data: subjects }
  } catch (error) {
    console.error("Error al obtener materias:", error)
    return { success: false, error: "Error al obtener las materias." }
  }
}

// Obtener todas las secciones
export async function getAllSections(filters = {}) {
  try {
    const sections = await prisma.section.findMany({
      where: filters,
      include: {
        subject: true,
        professor: {
          include: {
            user: true,
          },
        },
        period: true,
      },
      orderBy: {
        code: "asc",
      },
    })
    return { success: true, data: sections }
  } catch (error) {
    console.error("Error al obtener secciones:", error)
    return { success: false, error: "Error al obtener las secciones." }
  }
}

// Obtener todos los períodos académicos
export async function getAllPeriods(filters = {}) {
  try {
    const periods = await prisma.period.findMany({
      where: filters,
      orderBy: {
        startDate: "desc",
      },
    })
    return { success: true, data: periods }
  } catch (error) {
    console.error("Error al obtener períodos:", error)
    return { success: false, error: "Error al obtener los períodos académicos." }
  }
}

// Obtener todos los trayectos académicos
export async function getAllTrajectories(filters = {}) {
  try {
    const trajectories = await prisma.trajectory.findMany({
      where: filters,
      include: {
        firstPeriod: true,
        secondPeriod: true,
        thirdPeriod: true,
      },
      orderBy: {
        academicYear: "desc",
      },
    })
    return { success: true, data: trajectories }
  } catch (error) {
    console.error("Error al obtener trayectos:", error)
    return { success: false, error: "Error al obtener los trayectos académicos." }
  }
}

// Obtener todas las inscripciones
export async function getAllEnrollments(filters = {}) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: filters,
      include: {
        student: {
          include: {
            user: true,
          },
        },
        section: {
          include: {
            subject: true,
          },
        },
        period: true,
      },
      orderBy: {
        enrollmentDate: "desc",
      },
    })
    return { success: true, data: enrollments }
  } catch (error) {
    console.error("Error al obtener inscripciones:", error)
    return { success: false, error: "Error al obtener las inscripciones." }
  }
}

// Obtener todas las calificaciones
export async function getAllGrades(filters = {}) {
  try {
    const grades = await prisma.grade.findMany({
      where: filters,
      include: {
        student: {
          include: {
            user: true,
          },
        },
        section: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })
    return { success: true, data: grades }
  } catch (error) {
    console.error("Error al obtener calificaciones:", error)
    return { success: false, error: "Error al obtener las calificaciones." }
  }
}

// Obtener todos los documentos
export async function getAllDocuments(filters = {}) {
  try {
    const documents = await prisma.document.findMany({
      where: filters,
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return { success: true, data: documents }
  } catch (error) {
    console.error("Error al obtener documentos:", error)
    return { success: false, error: "Error al obtener los documentos." }
  }
}

// Obtener todos los materiales de clase
export async function getAllClassMaterials(filters = {}) {
  try {
    const materials = await prisma.classMaterial.findMany({
      where: filters,
      include: {
        professor: {
          include: {
            user: true,
          },
        },
        subject: true,
      },
      orderBy: {
        uploadDate: "desc",
      },
    })
    return { success: true, data: materials }
  } catch (error) {
    console.error("Error al obtener materiales de clase:", error)
    return { success: false, error: "Error al obtener los materiales de clase." }
  }
}

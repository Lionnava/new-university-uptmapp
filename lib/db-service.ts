import { prisma } from "./prisma"

// Servicios para Estudiantes
export async function getStudents(filters = {}) {
  return prisma.student.findMany({
    where: filters,
    include: {
      user: true,
      career: true,
    },
  })
}

export async function getStudentById(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      user: true,
      career: true,
      enrollments: {
        include: {
          section: {
            include: {
              subject: true,
            },
          },
        },
      },
      grades: true,
    },
  })
}

// Servicios para Profesores
export async function getProfessors(filters = {}) {
  return prisma.professor.findMany({
    where: filters,
    include: {
      user: true,
      department: true,
    },
  })
}

export async function getProfessorById(id: string) {
  return prisma.professor.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      sections: {
        include: {
          subject: true,
        },
      },
    },
  })
}

// Servicios para Materias
export async function getSubjects(filters = {}) {
  return prisma.subject.findMany({
    where: filters,
    include: {
      department: true,
      career: true,
    },
  })
}

export async function getSubjectById(id: string) {
  return prisma.subject.findUnique({
    where: { id },
    include: {
      department: true,
      career: true,
      sections: true,
    },
  })
}

// Servicios para Secciones
export async function getSections(filters = {}) {
  return prisma.section.findMany({
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
  })
}

// Servicios para Períodos Académicos
export async function getPeriods(filters = {}) {
  return prisma.period.findMany({
    where: filters,
  })
}

export async function getActivePeriod() {
  return prisma.period.findFirst({
    where: { isActive: true },
  })
}

// Servicios para Inscripciones
export async function getEnrollments(filters = {}) {
  return prisma.enrollment.findMany({
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
  })
}

// Servicios para Calificaciones
export async function getGrades(filters = {}) {
  return prisma.grade.findMany({
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
  })
}

// Servicios para Documentos
export async function getDocuments(filters = {}) {
  return prisma.document.findMany({
    where: filters,
    include: {
      student: {
        include: {
          user: true,
        },
      },
    },
  })
}

import prisma from "../config/prisma.js";
import type { CreateProjectInput } from "../types/api.types.js";

const projectListInclude = {
  tasks: true,
  projectTeams: { include: { team: true } },
} as const;

const projectDetailInclude = {
  tasks: {
    include: {
      author: true,
      assignee: true,
      attachments: true,
      comments: { include: { user: true } },
      taskAssignments: { include: { user: true } },
    },
  },
  projectTeams: {
    include: { team: { include: { users: true } } },
  },
} as const;

export async function getProjects() {
  return prisma.project.findMany({ include: projectListInclude });
}

export async function getProjectById(id: number) {
  return prisma.project.findUnique({ where: { id }, include: projectDetailInclude });
}

export async function createProject(data: CreateProjectInput) {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
    },
    include: projectListInclude,
  });
}

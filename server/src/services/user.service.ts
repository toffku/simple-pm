import prisma from "../config/prisma.js";

const userListInclude = {
  team: true,
  authoredTasks: true,
  assignedTasks: true,
  attachments: true,
  comments: true,
  taskAssignment: true,
} as const;

const userDetailInclude = {
  team: true,
  authoredTasks: true,
  assignedTasks: true,
  attachments: true,
  comments: true,
  taskAssignment: { include: { task: true } },
} as const;

export async function getUsers() {
  return prisma.user.findMany({ include: userListInclude });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id }, include: userDetailInclude });
}

import prisma from "../config/prisma.js";
import type { CreateTaskInput, UpdateTaskInput } from "../types/api.types.js";
import { AppError } from "../utils/AppError.js";

const taskInclude = {
  project: true,
  author: true,
  assignee: true,
  attachments: true,
  comments: { include: { user: true } },
  taskAssignments: { include: { user: true } },
} as const;

export async function getTasks() {
  return prisma.task.findMany({ include: taskInclude });
}

export async function getTaskById(id: number) {
  return prisma.task.findUnique({ where: { id }, include: taskInclude });
}

export async function createTask(data: CreateTaskInput) {
  const project = await prisma.project.findUnique({ where: { id: data.projectId } });
  if (!project) throw new AppError(404, "Project not found.");

  const author = await prisma.user.findFirst();
  if (!author) throw new AppError(500, "No users exist. Please seed the database first.");

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: "To Do",
      priority: data.priority,
      dueDate: data.dueDate,
      projectId: data.projectId,
      authorUserId: author.id,
    },
    include: taskInclude,
  });
}

export async function updateTask(id: number, data: UpdateTaskInput) {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Task not found.");

  return prisma.task.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
    },
    include: taskInclude,
  });
}

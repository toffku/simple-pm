import prisma from "../config/prisma.js";

export async function getTaskAssignments() {
  return prisma.taskAssignment.findMany({
    include: { task: true, user: true },
  });
}

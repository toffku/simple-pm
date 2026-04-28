import prisma from "../config/prisma.js";

export async function getComments() {
  return prisma.comment.findMany({
    include: { task: true, user: true },
  });
}

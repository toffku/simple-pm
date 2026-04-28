import prisma from "../config/prisma.js";

export async function getTeams() {
  return prisma.team.findMany({
    include: {
      users: true,
      projectTeams: { include: { project: true } },
    },
  });
}

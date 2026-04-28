import prisma from "../config/prisma.js";

export async function getProjectTeams() {
  return prisma.projectTeam.findMany({
    include: { project: true, team: true },
  });
}

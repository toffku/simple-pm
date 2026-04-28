import prisma from "../config/prisma.js";

export async function getAttachments() {
  return prisma.attachment.findMany({
    include: { task: true, uploadedBy: true },
  });
}

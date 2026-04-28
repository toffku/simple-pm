import type { Request, Response } from "express";
import * as attachmentService from "../services/attachment.service.js";

export async function getAttachments(_req: Request, res: Response): Promise<void> {
  const attachments = await attachmentService.getAttachments();
  res.status(200).json(attachments);
}

import type { Request, Response } from "express";
import * as commentService from "../services/comment.service.js";

export async function getComments(_req: Request, res: Response): Promise<void> {
  const comments = await commentService.getComments();
  res.status(200).json(comments);
}

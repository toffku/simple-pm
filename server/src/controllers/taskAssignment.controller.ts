import type { Request, Response } from "express";
import * as taskAssignmentService from "../services/taskAssignment.service.js";

export async function getTaskAssignments(_req: Request, res: Response): Promise<void> {
  const assignments = await taskAssignmentService.getTaskAssignments();
  res.status(200).json(assignments);
}

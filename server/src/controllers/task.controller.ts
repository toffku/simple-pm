import type { Request, Response } from "express";
import * as taskService from "../services/task.service.js";
import { validateCreateTask } from "../validators/task.validator.js";
import { parseId } from "../utils/parseId.js";
import { AppError } from "../utils/AppError.js";

export async function getTasks(_req: Request, res: Response): Promise<void> {
  const tasks = await taskService.getTasks();
  res.status(200).json(tasks);
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (id === null) throw new AppError(400, "Task id must be a number.");

  const task = await taskService.getTaskById(id);
  if (!task) throw new AppError(404, "Task not found.");

  res.status(200).json(task);
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const validation = validateCreateTask(req.body);
  if (!validation.ok) throw new AppError(validation.status, validation.error);

  const task = await taskService.createTask(validation.data);
  res.status(201).json(task);
}

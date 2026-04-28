import type { Request, Response } from "express";
import * as projectService from "../services/project.service.js";
import { validateCreateProject } from "../validators/project.validator.js";
import { parseId } from "../utils/parseId.js";
import { AppError } from "../utils/AppError.js";

export async function getProjects(_req: Request, res: Response): Promise<void> {
  const projects = await projectService.getProjects();
  res.status(200).json(projects);
}

export async function getProjectById(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (id === null) throw new AppError(400, "Project id must be a number.");

  const project = await projectService.getProjectById(id);
  if (!project) throw new AppError(404, "Project not found.");

  res.status(200).json(project);
}

export async function createProject(req: Request, res: Response): Promise<void> {
  const validation = validateCreateProject(req.body);
  if (!validation.ok) throw new AppError(validation.status, validation.error);

  const project = await projectService.createProject(validation.data);
  res.status(201).json(project);
}

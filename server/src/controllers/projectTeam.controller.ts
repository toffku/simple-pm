import type { Request, Response } from "express";
import * as projectTeamService from "../services/projectTeam.service.js";

export async function getProjectTeams(_req: Request, res: Response): Promise<void> {
  const projectTeams = await projectTeamService.getProjectTeams();
  res.status(200).json(projectTeams);
}

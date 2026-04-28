import type { Request, Response } from "express";
import * as teamService from "../services/team.service.js";

export async function getTeams(_req: Request, res: Response): Promise<void> {
  const teams = await teamService.getTeams();
  res.status(200).json(teams);
}

import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";
import { parseId } from "../utils/parseId.js";
import { AppError } from "../utils/AppError.js";

export async function getUsers(_req: Request, res: Response): Promise<void> {
  const users = await userService.getUsers();
  res.status(200).json(users);
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (id === null) throw new AppError(400, "User id must be a number.");

  const user = await userService.getUserById(id);
  if (!user) throw new AppError(404, "User not found.");

  res.status(200).json(user);
}

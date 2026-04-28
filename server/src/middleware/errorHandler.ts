import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res
        .status(409)
        .json({ error: "Could not create resource due to a conflict. Please try again." });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ error: "Resource not found." });
      return;
    }
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong." });
}

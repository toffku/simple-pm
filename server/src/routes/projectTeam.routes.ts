import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as projectTeamController from "../controllers/projectTeam.controller.js";

const router = Router();

router.get("/", asyncHandler(projectTeamController.getProjectTeams));

export default router;

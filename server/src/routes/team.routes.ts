import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as teamController from "../controllers/team.controller.js";

const router = Router();

router.get("/", asyncHandler(teamController.getTeams));

export default router;

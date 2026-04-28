import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as taskAssignmentController from "../controllers/taskAssignment.controller.js";

const router = Router();

router.get("/", asyncHandler(taskAssignmentController.getTaskAssignments));

export default router;

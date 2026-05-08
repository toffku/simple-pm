import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as projectController from "../controllers/project.controller.js";

const router = Router();

router.get("/", asyncHandler(projectController.getProjects));
router.get("/:id", asyncHandler(projectController.getProjectById));
router.post("/", asyncHandler(projectController.createProject));
router.patch("/:id", asyncHandler(projectController.updateProject));

export default router;

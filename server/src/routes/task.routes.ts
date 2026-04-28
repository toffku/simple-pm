import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as taskController from "../controllers/task.controller.js";

const router = Router();

router.get("/", asyncHandler(taskController.getTasks));
router.get("/:id", asyncHandler(taskController.getTaskById));
router.post("/", asyncHandler(taskController.createTask));
router.patch("/:id", asyncHandler(taskController.updateTask));

export default router;

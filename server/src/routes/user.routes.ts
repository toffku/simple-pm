import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get("/", asyncHandler(userController.getUsers));
router.get("/:id", asyncHandler(userController.getUserById));

export default router;

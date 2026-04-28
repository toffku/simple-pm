import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as commentController from "../controllers/comment.controller.js";

const router = Router();

router.get("/", asyncHandler(commentController.getComments));

export default router;

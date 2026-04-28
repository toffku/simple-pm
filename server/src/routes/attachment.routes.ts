import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as attachmentController from "../controllers/attachment.controller.js";

const router = Router();

router.get("/", asyncHandler(attachmentController.getAttachments));

export default router;

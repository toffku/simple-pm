import { Router } from "express";
import projectRoutes from "./project.routes.js";
import taskRoutes from "./task.routes.js";
import userRoutes from "./user.routes.js";
import teamRoutes from "./team.routes.js";
import projectTeamRoutes from "./projectTeam.routes.js";
import attachmentRoutes from "./attachment.routes.js";
import commentRoutes from "./comment.routes.js";
import taskAssignmentRoutes from "./taskAssignment.routes.js";

const router = Router();

router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/users", userRoutes);
router.use("/teams", teamRoutes);
router.use("/project-teams", projectTeamRoutes);
router.use("/attachments", attachmentRoutes);
router.use("/comments", commentRoutes);
router.use("/task-assignments", taskAssignmentRoutes);

export default router;

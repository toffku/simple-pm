import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (_req, res) => {
  res.send("This is Home route");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/api/projects", async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: true,
        projectTeams: {
          include: {
            team: true,
          },
        },
      },
    });
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
});

app.get("/api/projects/:id", async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    if (Number.isNaN(projectId)) {
      res.status(400).json({ error: "Project id must be a number." });
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          include: {
            author: true,
            assignee: true,
            attachments: true,
            comments: {
              include: {
                user: true,
              },
            },
            taskAssignments: {
              include: {
                user: true,
              },
            },
          },
        },
        projectTeams: {
          include: {
            team: {
              include: {
                users: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
});

app.get("/api/tasks", async (_req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
        author: true,
        assignee: true,
        attachments: true,
        comments: {
          include: {
            user: true,
          },
        },
        taskAssignments: {
          include: {
            user: true,
          },
        },
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

app.get("/api/tasks/:id", async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    if (Number.isNaN(taskId)) {
      res.status(400).json({ error: "Task id must be a number." });
      return;
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        author: true,
        assignee: true,
        attachments: true,
        comments: {
          include: {
            user: true,
          },
        },
        taskAssignments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

app.get("/api/users", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        team: true,
        authoredTasks: true,
        assignedTasks: true,
        attachments: true,
        comments: true,
        taskAssignment: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

app.get("/api/users/:id", async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      res.status(400).json({ error: "User id must be a number." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        team: true,
        authoredTasks: true,
        assignedTasks: true,
        attachments: true,
        comments: true,
        taskAssignment: {
          include: {
            task: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

app.get("/api/teams", async (_req, res, next) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        users: true,
        projectTeams: {
          include: {
            project: true,
          },
        },
      },
    });
    res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
});

app.get("/api/project-teams", async (_req, res, next) => {
  try {
    const projectTeams = await prisma.projectTeam.findMany({
      include: {
        project: true,
        team: true,
      },
    });
    res.status(200).json(projectTeams);
  } catch (error) {
    next(error);
  }
});

app.get("/api/attachments", async (_req, res, next) => {
  try {
    const attachments = await prisma.attachment.findMany({
      include: {
        task: true,
        uploadedBy: true,
      },
    });
    res.status(200).json(attachments);
  } catch (error) {
    next(error);
  }
});

app.get("/api/comments", async (_req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        task: true,
        user: true,
      },
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

app.get("/api/task-assignments", async (_req, res, next) => {
  try {
    const assignments = await prisma.taskAssignment.findMany({
      include: {
        task: true,
        user: true,
      },
    });
    res.status(200).json(assignments);
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

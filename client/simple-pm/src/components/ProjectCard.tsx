import { ProjectProps } from "@/types";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectProps;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const isCompleted = project.status === "completed";
  const total = Math.max(1, project.tasks.length);
  const completedPct = isCompleted
    ? 100
    : Math.round((project.completedCount / total) * 100);
  const inProgressPct = isCompleted
    ? 0
    : Math.round((project.inProgressCount / total) * 100);

  return (
    <Link to="/task/$projectId" params={{ projectId: String(project.id) }}>
      <Card
        className={cn(
          "mb-4 p-4 cursor-pointer transition duration-150 ease-in-out hover:bg-muted flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          isCompleted && "opacity-80",
        )}
      >
        <div className="w-full min-w-0 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <h1 className="font-bold text-xl">{project.title}</h1>
            {isCompleted && (
              <Badge
                variant="outline"
                className="shrink-0 border-emerald-500/40 text-emerald-700 dark:border-emerald-400/40 dark:text-emerald-400 px-2 gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                Done
              </Badge>
            )}
          </div>

          {!isCompleted && (
            <div className="text-xs flex flex-wrap gap-2 py-4 sm:py-5">
              <Badge
                variant="outline"
                className="border-emerald-500/40 text-emerald-700 dark:border-emerald-400/40 dark:text-emerald-400 px-2"
              >
                <span className="rounded-full w-2 h-2 bg-emerald-500 dark:bg-emerald-400 opacity-60"></span>
                {project.completedCount} Completed
              </Badge>
              <Badge
                variant="outline"
                className="border-sky-500/40 text-sky-700 dark:border-sky-400/40 dark:text-sky-400 px-2"
              >
                <span className="rounded-full w-2 h-2 bg-sky-500 dark:bg-sky-400 opacity-60"></span>
                {project.inProgressCount} In Progress
              </Badge>
              <Badge
                variant="outline"
                className="border-violet-500/40 text-violet-700 dark:border-violet-400/40 dark:text-violet-400 px-2"
              >
                <span className="rounded-full w-2 h-2 bg-violet-500 dark:bg-violet-400 opacity-60"></span>
                {project.todoCount} Not Complete
              </Badge>
            </div>
          )}

          {isCompleted && (
            <div className="text-xs flex flex-wrap gap-2 py-4 sm:py-5">
              <Badge
                variant="outline"
                className="border-emerald-500/40 text-emerald-700 dark:border-emerald-400/40 dark:text-emerald-400 px-2"
              >
                <span className="rounded-full w-2 h-2 bg-emerald-500 dark:bg-emerald-400 opacity-60"></span>
                {project.tasks.length} task{project.tasks.length !== 1 ? "s" : ""} completed
              </Badge>
            </div>
          )}

          <span className="w-full">
            <Progress
              segments={[
                { value: completedPct, color: "bg-emerald-500" },
                { value: inProgressPct, color: "bg-sky-500" },
              ]}
            />
          </span>
        </div>

        <div className="shrink-0 sm:w-[60px] flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
          {isCompleted ? (
            <span className="flex flex-col items-center sm:items-end gap-1">
              <CheckCircle2 className="h-7 w-7 text-emerald-500 dark:text-emerald-400" />
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Done
              </p>
            </span>
          ) : (
            <span className="flex items-end justify-center gap-2">
              <p className="font-bold text-4xl -mb-1">{project.daysLeft}</p>
              <p className="opacity-65 text-xs">days left</p>
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default ProjectCard;

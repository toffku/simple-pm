import { ProjectProps } from "@/types";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { urgencyColors } from "@/lib/theme";

interface ProjectCardProps {
  project: ProjectProps;
}

function daysLeftColorClass(daysLeft: number): string {
  if (daysLeft <= 3) return urgencyColors.critical;
  if (daysLeft <= 10) return urgencyColors.warning;
  return "text-foreground";
}

function formatNextTaskDate(dateStr: string): { label: string; isOverdue: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return { label: "overdue", isOverdue: true };
  if (diffDays === 0) return { label: "today", isOverdue: false };
  if (diffDays === 1) return { label: "tomorrow", isOverdue: false };
  return {
    label: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    isOverdue: false,
  };
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

  const nextTask = project.nextDueTask;
  const nextTaskDate =
    nextTask?.dueDate ? formatNextTaskDate(nextTask.dueDate) : null;

  return (
    <Link to="/task/$projectId" params={{ projectId: String(project.id) }}>
      <Card
        className={cn(
          "mb-4 p-4 cursor-pointer transition duration-150 ease-in-out hover:bg-muted flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          isCompleted && "opacity-80",
        )}
      >
        {/* ── Left section ─────────────────────────────────────── */}
        <div className="w-full min-w-0 flex flex-col gap-3">

          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h1 className="font-bold text-xl leading-tight">{project.title}</h1>
            {isCompleted && (
              <span className="shrink-0 inline-flex items-center gap-1 rounded-md border border-emerald-500/40 text-emerald-700 dark:border-emerald-400/40 dark:text-emerald-400 px-2 py-0.5 text-xs font-medium">
                <CheckCircle2 className="h-3 w-3" />
                Done
              </span>
            )}
            {!isCompleted && project.overdueTaskCount > 0 && (
              <span className="shrink-0 inline-flex items-center gap-1 rounded-md border border-rose-500/40 text-rose-700 dark:border-rose-400/40 dark:text-rose-400 px-2 py-0.5 text-xs font-medium">
                <AlertTriangle className="h-3 w-3" />
                {project.overdueTaskCount} overdue
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-1.5">
            <Progress
              segments={[
                { value: completedPct, color: "bg-emerald-500" },
                { value: inProgressPct, color: "bg-sky-500" },
              ]}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground tabular-nums">
                {isCompleted ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    All {project.tasks.length} task{project.tasks.length !== 1 ? "s" : ""} complete
                  </span>
                ) : (
                  <>
                    <span className="font-medium text-foreground">{completedPct}%</span>
                    {" · "}
                    {project.completedCount} / {project.tasks.length} tasks
                  </>
                )}
              </span>
              {!isCompleted && project.highPriorityCount > 0 && project.overdueTaskCount === 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                  {project.highPriorityCount} high priority
                </span>
              )}
            </div>
          </div>

          {/* Next actionable task */}
          {!isCompleted && nextTask && (
            <div className="flex items-center gap-1.5 text-xs min-w-0">
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/50" />
              <span className="truncate text-muted-foreground/70 italic">
                {nextTask.title}
              </span>
              {nextTaskDate && (
                <span
                  className={cn(
                    "shrink-0 tabular-nums font-medium",
                    nextTaskDate.isOverdue
                      ? "text-rose-500 dark:text-rose-400"
                      : "text-muted-foreground/60",
                  )}
                >
                  · {nextTaskDate.label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Right section ─────────────────────────────────────── */}
        <div className="shrink-0 sm:w-[72px] flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
          {isCompleted ? (
            <span className="flex flex-col items-center sm:items-end gap-1">
              <CheckCircle2 className="h-7 w-7 text-emerald-500 dark:text-emerald-400" />
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Done</p>
            </span>
          ) : project.isOverdue ? (
            <span className="flex flex-col items-center gap-1">
              <AlertTriangle className="h-6 w-6 text-rose-500 dark:text-rose-400" />
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Overdue</p>
            </span>
          ) : project.daysLeft > 0 ? (
            <span className="flex items-end justify-center gap-1.5">
              <p className={cn("font-bold text-4xl -mb-1 tabular-nums", daysLeftColorClass(project.daysLeft))}>
                {project.daysLeft}
              </p>
              <p className="opacity-65 text-xs pb-0.5">days</p>
            </span>
          ) : (
            <span className="flex flex-col items-center sm:items-end gap-1 opacity-35">
              <p className="font-bold text-3xl leading-none">—</p>
              <p className="text-xs">no deadline</p>
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default ProjectCard;

import { TaskProps } from "@/types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CalendarDays, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: TaskProps;
  onEdit?: () => void;
}

type PriorityVariant = "low" | "normal" | "high";

function getPriorityVariant(priority: string): PriorityVariant {
  const p = priority.toLowerCase();
  if (p === "high" || p === "urgent" || p === "critical") return "high";
  if (p === "low") return "low";
  return "normal";
}

type StatusStyle = { dot: string; text: string; border: string };

function getStatusStyle(status: string): StatusStyle {
  const s = status.toLowerCase();
  if (s.includes("progress")) {
    return {
      dot: "bg-indigo-500",
      text: "text-indigo-400",
      border: "border-indigo-500/40",
    };
  }
  if (s.includes("complete") || s.includes("done")) {
    return {
      dot: "bg-green-500",
      text: "text-green-400",
      border: "border-green-500/40",
    };
  }
  return {
    dot: "bg-pink-500",
    text: "text-pink-400",
    border: "border-pink-500/40",
  };
}

function formatDueDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const priorityVariant = getPriorityVariant(task.priority || "Normal");
  const statusStyle = getStatusStyle(task.status);

  return (
    <Card className="group mb-3 p-4 gap-0 cursor-pointer transition-all duration-150 ease-in-out hover:bg-muted hover:shadow-md">
      <div className="flex items-center justify-between gap-2 mb-3">
        <Badge variant={priorityVariant} className="capitalize text-[11px]">
          {task.priority || "Normal"}
        </Badge>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-[3px] text-[11px] font-medium",
              statusStyle.border,
              statusStyle.text,
            )}
          >
            <span
              className={cn(
                "rounded-full w-1.5 h-1.5 shrink-0",
                statusStyle.dot,
              )}
            />
            {task.status}
          </span>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-0.5 text-muted-foreground/60 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              aria-label="Edit task"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <h2 className="font-semibold text-sm leading-snug text-foreground mb-2">
        {task.title}
      </h2>

      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
        {task.description || "No description provided."}
      </p>

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 pt-2 border-t border-border/40">
        <CalendarDays className="w-3.5 h-3.5 shrink-0" />
        <span>{task.date ? formatDueDate(task.date) : "No due date"}</span>
      </div>
    </Card>
  );
};

export default TaskCard;

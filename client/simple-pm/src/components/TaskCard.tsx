import { useRef } from "react";
import { TaskProps } from "@/types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CalendarDays, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors, urgencyColors } from "@/lib/theme";

interface TaskCardProps {
  task: TaskProps;
  onEdit?: () => void;
  onStatusAdvance?: () => void;
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
    return { dot: statusColors.inProgress.dot, text: statusColors.inProgress.text, border: statusColors.inProgress.border };
  }
  if (s.includes("complete") || s.includes("done")) {
    return { dot: statusColors.done.dot, text: statusColors.done.text, border: statusColors.done.border };
  }
  return { dot: statusColors.todo.dot, text: statusColors.todo.text, border: statusColors.todo.border };
}

type DueDateInfo = { label: string; className: string };

function getDueDateInfo(dateStr: string | null): DueDateInfo {
  if (!dateStr) {
    return { label: "No due date", className: "text-muted-foreground/40" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) {
    return { label: formatDueDate(dateStr), className: `${urgencyColors.overdue} font-medium` };
  }
  if (diffDays === 0) {
    return { label: "Today", className: urgencyColors.today };
  }
  if (diffDays === 1) {
    return { label: "Tomorrow", className: urgencyColors.tomorrow };
  }
  return { label: formatDueDate(dateStr), className: "text-muted-foreground/60" };
}

function formatDueDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CLICK_COOLDOWN_MS = 400;

const TaskCard = ({ task, onEdit, onStatusAdvance }: TaskCardProps) => {
  const lastAdvanceTime = useRef(0);
  const priorityVariant = getPriorityVariant(task.priority || "Normal");
  const statusStyle = getStatusStyle(task.status);
  const dueDateInfo = getDueDateInfo(task.date);
  const isCompleted =
    task.status.toLowerCase().includes("complete") ||
    task.status.toLowerCase().includes("done");

  const handleCardClick = () => {
    const now = Date.now();
    if (now - lastAdvanceTime.current < CLICK_COOLDOWN_MS) return;
    lastAdvanceTime.current = now;
    onStatusAdvance?.();
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "mb-3 p-4 gap-0 cursor-pointer",
        "transition-all duration-150 ease-in-out",
        "hover:bg-muted hover:shadow-md",
        "active:scale-[0.985] active:shadow-inner",
        isCompleted && "opacity-60",
      )}
    >
      {/* Header: priority + status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <Badge variant={priorityVariant} className="capitalize text-[11px]">
          {task.priority || "Normal"}
        </Badge>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-[3px] text-[11px] font-medium",
            statusStyle.border,
            statusStyle.text,
          )}
        >
          <span className={cn("rounded-full w-1.5 h-1.5 shrink-0", statusStyle.dot)} />
          {task.status}
        </span>
      </div>

      {/* Title */}
      <h2
        className={cn(
          "font-semibold text-sm leading-snug text-foreground mb-2",
          isCompleted && "line-through",
        )}
      >
        {task.title}
      </h2>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
        {task.description || "No description provided."}
      </p>

      {/* Footer: due date left, edit right */}
      <div className="flex items-center justify-between pt-2.5 border-t border-border/40">
        <div className={cn("flex items-center gap-1.5 text-[11px]", dueDateInfo.className)}>
          <CalendarDays className="w-3.5 h-3.5 shrink-0" />
          <span>{dueDateInfo.label}</span>
        </div>
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className={cn(
              "-mr-2 -mb-2 p-2 rounded-md shrink-0",
              "text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent",
              "transition-colors cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            )}
            aria-label="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;

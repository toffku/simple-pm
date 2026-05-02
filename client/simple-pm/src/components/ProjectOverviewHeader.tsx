import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface ProjectOverviewHeaderProps {
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
  endDate: string | null;
}

function getDaysLeft(endDate: string | null): number | null {
  if (!endDate) return null;
  return Math.max(
    0,
    Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000),
  );
}

function daysLeftClass(days: number): string {
  if (days <= 3) return "text-red-400";
  if (days <= 10) return "text-amber-400";
  return "text-foreground";
}

export function ProjectOverviewHeader({
  completedCount,
  inProgressCount,
  totalCount,
  endDate,
}: ProjectOverviewHeaderProps) {
  const total = Math.max(1, totalCount);
  const completedPct = Math.round((completedCount / total) * 100);
  const inProgressPct = Math.round((inProgressCount / total) * 100);
  const daysLeft = getDaysLeft(endDate);

  const daysLabel =
    daysLeft === null
      ? "no deadline"
      : daysLeft === 1
        ? "day remaining"
        : "days remaining";

  return (
    <div className="mx-4 sm:mx-8 mb-2 rounded-lg border border-border bg-card px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        {/* Progress */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold leading-none tabular-nums">
                {completedPct}%
              </span>
              <span className="text-sm text-muted-foreground">complete</span>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {completedCount} / {totalCount} task{totalCount !== 1 ? "s" : ""}
            </span>
          </div>
          <Progress
            segments={[
              { value: completedPct, color: "bg-green-500" },
              { value: inProgressPct, color: "bg-orange-500" },
            ]}
            className="h-3"
          />
        </div>

        {/* Vertical divider — desktop only */}
        <div className="hidden h-12 w-px shrink-0 bg-border sm:block" />

        {/* Days left */}
        <div className="shrink-0 sm:text-right">
          <p
            className={cn(
              "text-3xl font-bold leading-none tabular-nums",
              daysLeft === null ? "text-muted-foreground/50" : daysLeftClass(daysLeft),
            )}
          >
            {daysLeft ?? "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{daysLabel}</p>
        </div>
      </div>
    </div>
  );
}

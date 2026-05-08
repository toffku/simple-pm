import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  activeCount: number;
  overdueTaskCount: number;
  dueSoonCount: number;
  completedCount: number;
}

interface StatChipProps {
  value: number;
  label: string;
  valueClass?: string;
}

function StatChip({ value, label, valueClass }: StatChipProps) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3">
      <p
        className={cn(
          "text-2xl font-bold tabular-nums leading-none",
          valueClass ?? "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1.5 leading-none">{label}</p>
    </div>
  );
}

export function DashboardStats({
  activeCount,
  overdueTaskCount,
  dueSoonCount,
  completedCount,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 sm:px-8 pb-4">
      <StatChip value={activeCount} label="active projects" />
      <StatChip
        value={overdueTaskCount}
        label="overdue tasks"
        valueClass={
          overdueTaskCount > 0 ? "text-rose-500 dark:text-rose-400" : undefined
        }
      />
      <StatChip
        value={dueSoonCount}
        label="due this week"
        valueClass={
          dueSoonCount > 0 ? "text-amber-500 dark:text-amber-400" : undefined
        }
      />
      <StatChip
        value={completedCount}
        label="completed"
        valueClass={
          completedCount > 0
            ? "text-emerald-500 dark:text-emerald-400"
            : undefined
        }
      />
    </div>
  );
}

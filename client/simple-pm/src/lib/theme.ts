// Semantic color tokens for the app's design system.
// All status, priority, and urgency colors are defined here.
// Import from this file rather than hardcoding color classes in components.

export const statusColors = {
  todo: {
    dot: "bg-violet-500",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-500/30 dark:border-violet-400/30",
    columnAccent: "border-l-violet-600 dark:border-l-violet-500",
    badgeClasses:
      "border-violet-500/40 text-violet-700 dark:border-violet-400/40 dark:text-violet-400",
    progressBar: "bg-violet-500 dark:bg-violet-400",
    dotMuted: "bg-muted-foreground/40",
  },
  inProgress: {
    dot: "bg-sky-500",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-500/30 dark:border-sky-400/30",
    columnAccent: "border-l-sky-600 dark:border-l-sky-500",
    badgeClasses:
      "border-sky-500/40 text-sky-700 dark:border-sky-400/40 dark:text-sky-400",
    progressBar: "bg-sky-500 dark:bg-sky-400",
  },
  done: {
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/30 dark:border-emerald-400/30",
    columnAccent: "border-l-emerald-600 dark:border-l-emerald-500",
    badgeClasses:
      "border-emerald-500/40 text-emerald-700 dark:border-emerald-400/40 dark:text-emerald-400",
    progressBar: "bg-emerald-500 dark:bg-emerald-400",
  },
} as const;

export const urgencyColors = {
  overdue: "text-rose-600 dark:text-rose-400",
  today: "text-amber-600 dark:text-amber-400",
  tomorrow: "text-amber-600/70 dark:text-amber-400/70",
  critical: "text-rose-600 dark:text-rose-400",   // days left ≤ 3
  warning: "text-amber-600 dark:text-amber-400",  // days left ≤ 10
} as const;

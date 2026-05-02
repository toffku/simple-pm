import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function StatusToast({
  message,
  onUndo,
  onDismiss,
  duration = 5000,
}: StatusToastProps) {
  const [progressWidth, setProgressWidth] = useState(100);
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgressWidth(100);

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 1 - elapsed / duration);
      setProgressWidth(remaining * 100);
      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration, message]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 min-w-72 max-w-sm",
        "rounded-lg border border-border bg-card shadow-xl overflow-hidden",
        "animate-in slide-in-from-bottom-4 fade-in duration-200",
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm text-foreground truncate">{message}</p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onUndo}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer whitespace-nowrap"
          >
            Undo
          </button>
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="h-0.5 bg-muted">
        <div
          className="h-full bg-primary"
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  );
}

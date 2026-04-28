import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectErrorStateProps {
  onRetry: () => void;
}

export function ProjectErrorState({ onRetry }: ProjectErrorStateProps) {
  return (
    <div className="p-8 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-8 py-10 text-center max-w-sm w-full shadow-sm">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <AlertCircle className="size-5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-base font-semibold text-foreground">
            Unable to load projects
          </p>
          <p className="text-sm text-muted-foreground">
            There was a problem loading your projects. Please try again.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={onRetry}
          className="cursor-pointer"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

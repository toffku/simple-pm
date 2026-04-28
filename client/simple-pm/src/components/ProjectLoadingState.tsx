import { Spinner } from "@/components/ui/spinner";

export function ProjectLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
      <Spinner className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading projects...</p>
    </div>
  );
}

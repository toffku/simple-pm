import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface ProjectEmptyStateProps {
  onAddProject: () => void;
}

export function ProjectEmptyState({ onAddProject }: ProjectEmptyStateProps) {
  return (
    <div className="p-8">
      <Empty className="border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderOpen />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>
            Create your first project to start managing tasks and tracking
            progress.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="secondary" onClick={onAddProject}>
            <Plus />
            Add your first project
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

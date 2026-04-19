import ProjectDashboard from "@/components/ProjectDashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: BoardPage,
});

function BoardPage() {
  return <ProjectDashboard />;
}

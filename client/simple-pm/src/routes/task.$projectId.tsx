import TasksDashboard from "@/components/TasksDashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/task/$projectId")({
  component: TasksPage,
});

function TasksPage() {
  return <TasksDashboard />;
}

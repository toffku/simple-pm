import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/task/")({
  beforeLoad: () => {
    throw redirect({
      to: "/task/$projectId",
      params: { projectId: "proj-01" },
    });
  },
});

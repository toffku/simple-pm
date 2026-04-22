import { ProjectProps } from "@/types";
import ProjectCard from "./ProjectCard";
import { ArrowDownUp, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { fetchJson } from "@/lib/api";
import { ApiProject } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "./ui/spinner";

const ProjectDashboard = () => {
  const [projectsData, setProjectsData] = useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchJson<ApiProject[]>("/api/projects");
        setProjectsData(data);
      } catch (_error) {
        setError("Unable to load projects.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadProjects();
  }, []);

  const projects = useMemo<ProjectProps[]>(() => {
    const now = new Date();

    return projectsData.map((project) => {
      const completedCount = project.tasks.filter((task) =>
        (task.status ?? "").toLowerCase().includes("complete")
      ).length;
      const inProgressCount = project.tasks.filter((task) =>
        (task.status ?? "").toLowerCase().includes("progress")
      ).length;
      const todoCount = project.tasks.length - completedCount - inProgressCount;
      const endDate = project.endDate ? new Date(project.endDate) : null;
      const daysLeft = endDate
        ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

      return {
        id: project.id,
        title: project.name,
        daysLeft,
        completedCount,
        inProgressCount,
        todoCount,
        tasks: project.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          date: task.dueDate,
          description: task.description ?? "No description",
          status: task.status ?? "To Do",
          priority: task.priority ?? "Normal",
        })),
      };
    });
  }, [projectsData]);

  if (isLoading) {
    return <div className="p-8"><Spinner /></div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold p-8">Projects</h1>
      </div>
      <div className="px-8 w-full flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <Button
          variant="secondary"
          className="flex items-center bg-transparent cursor-pointer px-2 w-full sm:w-auto justify-center sm:justify-start"
        >
          <ArrowDownUp width={18} />
          <p className="font-semibold opacity-95 text-sm">Sort</p>
        </Button>
        <Button
          variant="secondary"
          className="flex items-center cursor-pointer px-2 w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus width={18} />
          <p className="font-semibold opacity-95 pb-0.5 text-sm">
            Add a new project
          </p>
        </Button>
      </div>
      <div className="p-8 grid grid-cols-1 gap-4 md:grid-cols-2 w-full max-w-3xl md:max-w-full mx-auto">
        {projects.map((project: ProjectProps) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
};

export default ProjectDashboard;

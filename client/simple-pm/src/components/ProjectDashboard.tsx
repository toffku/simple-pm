import { ProjectProps } from "@/types";
import ProjectCard from "./ProjectCard";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { fetchJson } from "@/lib/api";
import { ApiProject } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import AddProjectCard from "./AddProjectCard";
import { ProjectSortDropdown, SortOption } from "./ProjectSortDropdown";
import { ProjectLoadingState } from "./ProjectLoadingState";
import { ProjectErrorState } from "./ProjectErrorState";
import { ProjectEmptyState } from "./ProjectEmptyState";
import { DashboardStats } from "./DashboardStats";

const ProjectDashboard = () => {
  const [projectsData, setProjectsData] = useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("attention");
  const [showCompleted, setShowCompleted] = useState(false);

  const loadProjects = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const projects = useMemo<ProjectProps[]>(() => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);

    return projectsData.map((project) => {
      const completedCount = project.tasks.filter((t) =>
        (t.status ?? "").toLowerCase().includes("complete"),
      ).length;
      const inProgressCount = project.tasks.filter((t) =>
        (t.status ?? "").toLowerCase().includes("progress"),
      ).length;
      const todoCount = project.tasks.length - completedCount - inProgressCount;

      const endDate = project.endDate ? new Date(project.endDate) : null;
      const isOverdue = endDate ? endDate < now : false;
      const daysLeft = endDate && !isOverdue
        ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      const completedPct = Math.round(
        (completedCount / Math.max(1, project.tasks.length)) * 100,
      );

      const openTasks = project.tasks.filter((t) => {
        const s = (t.status ?? "").toLowerCase();
        return !s.includes("complete") && !s.includes("done");
      });

      const overdueTaskCount = openTasks.filter((t) => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        d.setHours(0, 0, 0, 0);
        return d < today;
      }).length;

      const dueSoonCount = openTasks.filter((t) => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        d.setHours(0, 0, 0, 0);
        return d >= today && d <= weekFromNow;
      }).length;

      const highPriorityCount = openTasks.filter((t) => {
        const p = (t.priority ?? "").toLowerCase();
        return p === "high" || p === "urgent" || p === "critical";
      }).length;

      const nextDueTask =
        openTasks
          .filter((t) => t.dueDate)
          .sort(
            (a, b) =>
              new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
          )[0] ?? null;

      const attentionScore =
        (isOverdue ? 1000 : 0) +
        overdueTaskCount * 50 +
        highPriorityCount * 20 +
        (project.tasks.length > 0 && completedPct < 25 ? 30 : 0) +
        (daysLeft > 0 && daysLeft <= 7 ? (7 - daysLeft) * 10 : 0);

      return {
        id: project.id,
        title: project.name,
        status: project.status ?? "active",
        daysLeft,
        isOverdue,
        completedCount,
        inProgressCount,
        todoCount,
        overdueTaskCount,
        dueSoonCount,
        highPriorityCount,
        nextDueTask: nextDueTask
          ? { title: nextDueTask.title, dueDate: nextDueTask.dueDate }
          : null,
        attentionScore,
        tasks: project.tasks.map((t) => ({
          id: t.id,
          title: t.title,
          date: t.dueDate,
          description: t.description ?? "No description",
          status: t.status ?? "To Do",
          priority: t.priority ?? "Normal",
        })),
      };
    });
  }, [projectsData]);

  const sortedProjects = useMemo<ProjectProps[]>(() => {
    const copy = [...projects];
    switch (sortOption) {
      case "attention":
        return copy.sort((a, b) => {
          if (b.attentionScore !== a.attentionScore)
            return b.attentionScore - a.attentionScore;
          return b.id - a.id;
        });
      case "newest":
        return copy.sort((a, b) => b.id - a.id);
      case "oldest":
        return copy.sort((a, b) => a.id - b.id);
      case "alpha-asc":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "alpha-desc":
        return copy.sort((a, b) => b.title.localeCompare(a.title));
    }
  }, [projects, sortOption]);

  const activeProjects = useMemo(
    () => sortedProjects.filter((p) => p.status !== "completed"),
    [sortedProjects],
  );

  const completedProjects = useMemo(
    () => sortedProjects.filter((p) => p.status === "completed"),
    [sortedProjects],
  );

  const stats = useMemo(() => {
    const totalOverdueTasks = activeProjects.reduce(
      (sum, p) => sum + p.overdueTaskCount,
      0,
    );
    const totalDueSoon = activeProjects.reduce(
      (sum, p) => sum + p.dueSoonCount,
      0,
    );
    return {
      activeCount: activeProjects.length,
      overdueTaskCount: totalOverdueTasks,
      dueSoonCount: totalDueSoon,
      completedCount: completedProjects.length,
    };
  }, [activeProjects, completedProjects]);

  const hasOnlyCompleted =
    activeProjects.length === 0 && completedProjects.length > 0;

  return (
    <>
      {showAddProjectModal && (
        <AddProjectCard
          onClose={() => setShowAddProjectModal(false)}
          onProjectCreated={() => void loadProjects()}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 pb-4">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ProjectSortDropdown value={sortOption} onChange={setSortOption} />
          <Button
            variant="secondary"
            className="flex items-center cursor-pointer px-2 w-full sm:w-auto justify-center sm:justify-start"
            onClick={() => setShowAddProjectModal(true)}
          >
            <Plus width={18} />
            <p className="font-semibold opacity-95 pb-0.5 text-sm">
              Add a new project
            </p>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <ProjectLoadingState />
      ) : error ? (
        <ProjectErrorState onRetry={() => void loadProjects()} />
      ) : sortedProjects.length === 0 ? (
        <ProjectEmptyState onAddProject={() => setShowAddProjectModal(true)} />
      ) : (
        <>
          <DashboardStats {...stats} />

          {hasOnlyCompleted ? (
            <div className="px-4 sm:px-8 pb-2">
              <p className="text-sm text-muted-foreground">
                All projects are completed.
              </p>
            </div>
          ) : (
            <div className="px-4 sm:px-8 grid grid-cols-1 gap-4 md:grid-cols-2 w-full max-w-3xl md:max-w-full mx-auto">
              {activeProjects.map((project: ProjectProps) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {completedProjects.length > 0 && (
            <div
              className={
                hasOnlyCompleted ? "px-4 sm:px-8" : "px-4 sm:px-8 mt-2"
              }
            >
              <button
                onClick={() => setShowCompleted((v) => !v)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer"
              >
                {showCompleted ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span>
                  {showCompleted ? "Hide" : "Show"} completed projects (
                  {completedProjects.length})
                </span>
              </button>

              {showCompleted && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full max-w-3xl md:max-w-full mx-auto pt-2 pb-8">
                  {completedProjects.map((project: ProjectProps) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProjectDashboard;

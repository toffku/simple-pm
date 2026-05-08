import { fetchJson, patchJson } from "@/lib/api";
import { ApiProject, ApiTask, TaskProps } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AddTaskCard from "./AddTaskCard";
import EditTaskCard from "./EditTaskCard";
import TaskCard from "./TaskCard";
import { StatusToast } from "./ui/toast";
import { ProjectViewLoadingState } from "./ProjectViewLoadingState";
import { ProjectViewErrorState } from "./ProjectViewErrorState";
import { ProjectOverviewHeader } from "./ProjectOverviewHeader";
import { Plus, CheckCircle2, RotateCcw, X } from "lucide-react";
import { Button } from "./ui/button";

type TaskColumn = "todo" | "inProgress" | "completed";

interface TasksDashboardProps {
  projectId: string;
}

interface ToastState {
  taskId: number;
  taskTitle: string;
  prevStatus: string;
  newStatus: string;
}

const COMMIT_DELAY_MS = 5000;

function normalizeProjectId(value: string): string {
  if (/^\d+$/.test(value)) {
    return value;
  }
  const numericPart = value.match(/\d+/)?.[0];
  return numericPart ? String(Number(numericPart)) : value;
}

function nextStatus(current: string): string {
  const s = current.toLowerCase();
  if (s.includes("progress")) return "Completed";
  if (s.includes("complete") || s.includes("done")) return "To Do";
  return "Work In Progress";
}

function displayStatus(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("progress")) return "In Progress";
  if (s.includes("complete") || s.includes("done")) return "Completed";
  return "To Do";
}

const TasksDashboard = ({ projectId }: TasksDashboardProps) => {
  const [project, setProject] = useState<ApiProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskProps | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<number, string>
  >({});
  const [toast, setToast] = useState<ToastState | null>(null);
  const [completionBannerDismissed, setCompletionBannerDismissed] =
    useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const pendingTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>(
    {},
  );

  const loadProject = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const normalizedProjectId = normalizeProjectId(projectId);
      const data = await fetchJson<ApiProject>(
        `/api/projects/${normalizedProjectId}`,
      );
      setProject(data);
      setStatusOverrides((prev) => {
        const active = new Set(Object.keys(pendingTimers.current).map(Number));
        return Object.fromEntries(
          Object.entries(prev).filter(([id]) => active.has(Number(id))),
        );
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Unable to load project tasks. ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  // Reset banner dismissal when navigating to a different project
  useEffect(() => {
    setCompletionBannerDismissed(false);
  }, [projectId]);

  useEffect(() => {
    const timers = pendingTimers.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  const groupedTasks = useMemo(() => {
    const grouped: Record<TaskColumn, TaskProps[]> = {
      todo: [],
      inProgress: [],
      completed: [],
    };

    project?.tasks.forEach((task) => {
      const effectiveStatus =
        statusOverrides[task.id] ?? task.status ?? "To Do";
      const mappedTask: TaskProps = {
        id: task.id,
        title: task.title,
        date: task.dueDate,
        description: task.description ?? "No description",
        priority: task.priority ?? "Normal",
        status: effectiveStatus,
      };

      const s = effectiveStatus.toLowerCase();
      if (s.includes("progress")) {
        grouped.inProgress.push(mappedTask);
      } else if (s.includes("complete") || s.includes("done")) {
        grouped.completed.push(mappedTask);
      } else {
        grouped.todo.push(mappedTask);
      }
    });

    return grouped;
  }, [project, statusOverrides]);

  const cancelPendingChange = useCallback((taskId: number) => {
    if (pendingTimers.current[taskId]) {
      clearTimeout(pendingTimers.current[taskId]);
      delete pendingTimers.current[taskId];
    }
    setStatusOverrides((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
    setToast((prev) => (prev?.taskId === taskId ? null : prev));
  }, []);

  const handleStatusAdvance = (task: TaskProps) => {
    const currentStatus = task.status;
    const newStatus = nextStatus(currentStatus);

    if (pendingTimers.current[task.id]) {
      clearTimeout(pendingTimers.current[task.id]);
    }

    setStatusOverrides((prev) => ({ ...prev, [task.id]: newStatus }));

    setToast({
      taskId: task.id,
      taskTitle: task.title,
      prevStatus: currentStatus,
      newStatus,
    });

    pendingTimers.current[task.id] = setTimeout(() => {
      delete pendingTimers.current[task.id];
      setToast((prev) => (prev?.taskId === task.id ? null : prev));

      void patchJson<ApiTask>(`/api/tasks/${task.id}`, {
        title: task.title,
        description:
          task.description === "No description" ? null : task.description,
        status: newStatus,
        priority: task.priority || null,
        dueDate: task.date || null,
      })
        .then(() => {
          setStatusOverrides((prev) => {
            const next = { ...prev };
            delete next[task.id];
            return next;
          });
          void loadProject();
        })
        .catch(() => {
          setStatusOverrides((prev) => ({ ...prev, [task.id]: currentStatus }));
        });
    }, COMMIT_DELAY_MS);
  };

  const handleUndo = () => {
    if (!toast) return;
    const { taskId, prevStatus } = toast;

    if (pendingTimers.current[taskId]) {
      clearTimeout(pendingTimers.current[taskId]);
      delete pendingTimers.current[taskId];
    }

    setStatusOverrides((prev) => {
      const serverStatus =
        project?.tasks.find((t) => t.id === taskId)?.status ?? "To Do";
      if (prevStatus === serverStatus) {
        const next = { ...prev };
        delete next[taskId];
        return next;
      }
      return { ...prev, [taskId]: prevStatus };
    });

    setToast(null);
  };

  const handleMarkComplete = async () => {
    if (!project) return;
    setIsUpdatingStatus(true);
    try {
      await patchJson<ApiProject>(`/api/projects/${project.id}`, {
        status: "completed",
      });
      await loadProject();
    } catch {
      // status update failed — UI stays as-is
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReopenProject = async () => {
    if (!project) return;
    setIsUpdatingStatus(true);
    try {
      await patchJson<ApiProject>(`/api/projects/${project.id}`, {
        status: "active",
      });
      await loadProject();
    } catch {
      // status update failed — UI stays as-is
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) return <ProjectViewLoadingState />;
  if (error) return <ProjectViewErrorState onRetry={() => void loadProject()} />;
  if (!project) return <ProjectViewErrorState onRetry={() => void loadProject()} />;

  const numericProjectId = Number(normalizeProjectId(projectId));
  const projectStatus = project.status ?? "active";
  const isProjectCompleted = projectStatus === "completed";

  const allTasksDone =
    !isProjectCompleted &&
    project.tasks.length > 0 &&
    groupedTasks.todo.length === 0 &&
    groupedTasks.inProgress.length === 0;

  const showCompletionSuggestion = allTasksDone && !completionBannerDismissed;

  return (
    <>
      {showAddTaskModal && (
        <AddTaskCard
          projectId={numericProjectId}
          onClose={() => setShowAddTaskModal(false)}
          onTaskCreated={() => void loadProject()}
        />
      )}
      {editingTask && (
        <EditTaskCard
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={() => void loadProject()}
        />
      )}
      {toast && (
        <StatusToast
          message={`"${toast.taskTitle}" moved to ${displayStatus(toast.newStatus)}`}
          onUndo={handleUndo}
          onDismiss={() => setToast(null)}
          duration={COMMIT_DELAY_MS}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        {isProjectCompleted ? (
          <Button
            variant="secondary"
            className="flex items-center cursor-pointer px-2 w-full sm:w-auto justify-center sm:justify-start"
            onClick={() => void handleReopenProject()}
            disabled={isUpdatingStatus}
          >
            <RotateCcw width={16} />
            <p className="font-semibold opacity-95 pb-0.5 text-sm">
              {isUpdatingStatus ? "Reopening..." : "Reopen project"}
            </p>
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="flex items-center cursor-pointer px-2 w-full sm:w-auto justify-center sm:justify-start"
            onClick={() => setShowAddTaskModal(true)}
          >
            <Plus width={18} />
            <p className="font-semibold opacity-95 pb-0.5 text-sm">
              Add a new task
            </p>
          </Button>
        )}
      </div>

      {/* Completion suggestion banner — all tasks done, project still active */}
      {showCompletionSuggestion && (
        <div className="mx-4 sm:mx-8 mb-3 flex items-center justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 dark:text-emerald-400" />
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              All tasks are complete — ready to mark this project as done?
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="sm"
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 h-8 px-3 text-xs"
              onClick={() => void handleMarkComplete()}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? "Saving..." : "Mark complete"}
            </Button>
            <button
              onClick={() => setCompletionBannerDismissed(true)}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Completed project banner */}
      {isProjectCompleted && (
        <div className="mx-4 sm:mx-8 mb-3 flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 dark:text-emerald-400" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            This project is complete. Reopen it to make changes.
          </p>
        </div>
      )}

      <ProjectOverviewHeader
        completedCount={groupedTasks.completed.length}
        inProgressCount={groupedTasks.inProgress.length}
        totalCount={project.tasks.length}
        endDate={project.endDate}
      />

      <div className="mx-4 sm:mx-8 p-4 rounded-md border border-l-8 bg-card border-l-violet-600 dark:border-l-violet-500">
        <h1 className="font-bold">To Do</h1>
      </div>
      <div className="p-4 sm:p-8">
        {groupedTasks.todo.map((task: TaskProps) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => {
              cancelPendingChange(task.id);
              setEditingTask(task);
            }}
            onStatusAdvance={() => handleStatusAdvance(task)}
          />
        ))}
      </div>

      <div className="mx-4 sm:mx-8 p-4 rounded-md border bg-card border-l-8 border-l-sky-600 dark:border-l-sky-500">
        <h1 className="font-bold">In Progress</h1>
      </div>
      <div className="p-4 sm:p-8">
        {groupedTasks.inProgress.map((task: TaskProps) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => {
              cancelPendingChange(task.id);
              setEditingTask(task);
            }}
            onStatusAdvance={() => handleStatusAdvance(task)}
          />
        ))}
      </div>

      <div className="mx-4 sm:mx-8 p-4 rounded-md border bg-card border-l-8 border-l-emerald-600 dark:border-l-emerald-500">
        <h1 className="font-bold">Completed</h1>
      </div>
      <div className="p-4 sm:p-8">
        {groupedTasks.completed.map((task: TaskProps) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => {
              cancelPendingChange(task.id);
              setEditingTask(task);
            }}
            onStatusAdvance={() => handleStatusAdvance(task)}
          />
        ))}
      </div>
    </>
  );
};

export default TasksDashboard;

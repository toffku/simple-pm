import { fetchJson, patchJson } from "@/lib/api";
import { ApiProject, ApiTask, TaskProps } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AddTaskCard from "./AddTaskCard";
import EditTaskCard from "./EditTaskCard";
import TaskCard from "./TaskCard";
import { StatusToast } from "./ui/toast";
import { ProjectViewLoadingState } from "./ProjectViewLoadingState";
import { ProjectViewErrorState } from "./ProjectViewErrorState";
import { Plus } from "lucide-react";
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
      // Clear overrides for tasks that have no pending timer (already committed or stale)
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
    // task.status is the effective status (override already applied via groupedTasks memo)
    const currentStatus = task.status;
    const newStatus = nextStatus(currentStatus);

    // Cancel any pending commit for this task (user clicked again before timer fired)
    if (pendingTimers.current[task.id]) {
      clearTimeout(pendingTimers.current[task.id]);
    }

    // Optimistic update — moves the card to the correct column immediately
    setStatusOverrides((prev) => ({ ...prev, [task.id]: newStatus }));

    // Show undo toast
    setToast({
      taskId: task.id,
      taskTitle: task.title,
      prevStatus: currentStatus,
      newStatus,
    });

    // Delay-then-commit: PATCH fires after COMMIT_DELAY_MS unless undone
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
          // Clear the override and sync fresh server state
          setStatusOverrides((prev) => {
            const next = { ...prev };
            delete next[task.id];
            return next;
          });
          void loadProject();
        })
        .catch(() => {
          // Revert optimistic update on network failure
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
      // If prevStatus matches the server value, remove the override entirely
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

  if (isLoading) return <ProjectViewLoadingState />;
  if (error) return <ProjectViewErrorState onRetry={() => void loadProject()} />;
  if (!project) return <ProjectViewErrorState onRetry={() => void loadProject()} />;

  const numericProjectId = Number(normalizeProjectId(projectId));

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
      </div>
      <div className="mx-4 sm:mx-8 p-4 rounded-md border border-l-8 bg-card border-l-pink-700">
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
      <div className="mx-4 sm:mx-8 p-4 rounded-md border bg-card border-l-8 border-l-indigo-700">
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
      <div className="mx-4 sm:mx-8 p-4 rounded-md border bg-card border-l-8 border-l-green-700">
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

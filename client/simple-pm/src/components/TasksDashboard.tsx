import { fetchJson } from "@/lib/api";
import { ApiProject, TaskProps } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import AddTaskCard from "./AddTaskCard";
import EditTaskCard from "./EditTaskCard";
import TaskCard from "./TaskCard";
import { Spinner } from "./ui/spinner";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

type TaskColumn = "todo" | "inProgress" | "completed";

interface TasksDashboardProps {
  projectId: string;
}

function normalizeProjectId(value: string): string {
  if (/^\d+$/.test(value)) {
    return value;
  }

  const numericPart = value.match(/\d+/)?.[0];
  return numericPart ? String(Number(numericPart)) : value;
}

const TasksDashboard = ({ projectId }: TasksDashboardProps) => {
  const [project, setProject] = useState<ApiProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskProps | null>(null);

  const loadProject = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const normalizedProjectId = normalizeProjectId(projectId);
      const data = await fetchJson<ApiProject>(
        `/api/projects/${normalizedProjectId}`,
      );
      setProject(data);
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

  const groupedTasks = useMemo(() => {
    const grouped: Record<TaskColumn, TaskProps[]> = {
      todo: [],
      inProgress: [],
      completed: [],
    };

    project?.tasks.forEach((task) => {
      const mappedTask: TaskProps = {
        id: task.id,
        title: task.title,
        date: task.dueDate,
        description: task.description ?? "No description",
        priority: task.priority ?? "Normal",
        status: task.status ?? "To Do",
      };

      const status = (task.status ?? "").toLowerCase();
      if (status.includes("progress")) {
        grouped.inProgress.push(mappedTask);
      } else if (status.includes("complete") || status.includes("done")) {
        grouped.completed.push(mappedTask);
      } else {
        grouped.todo.push(mappedTask);
      }
    });

    return grouped;
  }, [project]);

  if (isLoading) {
    return (
      <div className="p-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!project) {
    return <div className="p-8">Project not found.</div>;
  }

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
      <div className="flex flex-row justify-between items-center p-8">
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
      <div className="mx-8 p-4 rounded-md border border-l-8 bg-card border-l-pink-700">
        <h1 className="font-bold">To Do</h1>
      </div>
      <div className="p-8">
        {groupedTasks.todo.map((task: TaskProps) => (
          <TaskCard key={task.id} task={task} onEdit={() => setEditingTask(task)} />
        ))}
      </div>
      <div className="mx-8 p-4 rounded-md border bg-card border-l-8 border-l-indigo-700">
        <h1 className="font-bold">In Progress</h1>
      </div>
      <div className="p-8">
        {groupedTasks.inProgress.map((task: TaskProps) => (
          <TaskCard key={task.id} task={task} onEdit={() => setEditingTask(task)} />
        ))}
      </div>
      <div className="mx-8 p-4 rounded-md border bg-card border-l-8 border-l-green-700">
        <h1 className="font-bold">Completed</h1>
      </div>
      <div className="p-8">
        {groupedTasks.completed.map((task: TaskProps) => (
          <TaskCard key={task.id} task={task} onEdit={() => setEditingTask(task)} />
        ))}
      </div>
    </>
  );
};

export default TasksDashboard;

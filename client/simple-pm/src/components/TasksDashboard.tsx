import { fetchJson } from "@/lib/api";
import { ApiProject, TaskProps } from "@/types";
import { useEffect, useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { Spinner } from "./ui/spinner";

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

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const normalizedProjectId = normalizeProjectId(projectId);
        const data = await fetchJson<ApiProject>(`/api/projects/${normalizedProjectId}`);
        setProject(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(`Unable to load project tasks. ${message}`);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProject();
  }, [projectId]);

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
    return <div className="p-8"><Spinner /></div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!project) {
    return <div className="p-8">Project not found.</div>;
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold p-8">{project.name}</h1>
      </div>
      <div className="mx-8 p-4 rounded-md border border-l-8 bg-card border-l-pink-700">
        <h1 className="font-bold">To Do</h1>
      </div>
      <div className="p-8">
        {groupedTasks.todo.map((task: TaskProps) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      <div className="mx-8 p-4 rounded-md border bg-card border-l-8 border-l-indigo-700">
        <h1 className="font-bold">In Progress</h1>
      </div>
      <div className="p-8">
        {groupedTasks.inProgress.map((task: TaskProps) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      <div className="mx-8 p-4 rounded-md border bg-card border-l-8 border-l-green-700">
        <h1 className="font-bold">Completed</h1>
      </div>
      <div className="p-8">
        {groupedTasks.completed.map((task: TaskProps) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </>
  );
};

export default TasksDashboard;

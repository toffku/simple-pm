export type TaskProps = {
  id: number;
  title: string;
  date: string | null;
  description: string;
  status: string;
  priority: string;
  projectName?: string;
};

export type ProjectProps = {
  id: number;
  title: string;
  daysLeft: number;
  completedCount: number;
  inProgressCount: number;
  todoCount: number;
  tasks: TaskProps[];
};

export type ApiTask = {
  id: number;
  title: string;
  description: string | null;
  status: string | null;
  priority: string | null;
  dueDate: string | null;
  projectId: number;
  project?: {
    id: number;
    name: string;
  };
};

export type ApiProject = {
  id: number;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  tasks: ApiTask[];
};

export interface CreateProjectInput {
  name: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

export interface CreateTaskInput {
  title: string;
  description: string | null;
  priority: string | null;
  dueDate: Date | null;
  projectId: number;
}

export interface UpdateTaskInput {
  title: string;
  description: string | null;
  status: string | null;
  priority: string | null;
  dueDate: Date | null;
}

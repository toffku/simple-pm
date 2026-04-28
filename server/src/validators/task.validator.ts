import type { CreateTaskInput } from "../types/api.types.js";

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

export function validateCreateTask(
  body: unknown,
): ValidationResult<CreateTaskInput> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body.", status: 400 };
  }

  const { title, description, priority, dueDate, projectId } = body as Record<
    string,
    unknown
  >;

  if (typeof title !== "string" || !title.trim()) {
    return { ok: false, error: "Task title is required.", status: 400 };
  }

  if (
    typeof projectId !== "number" ||
    !Number.isInteger(projectId) ||
    projectId <= 0
  ) {
    return { ok: false, error: "A valid project ID is required.", status: 400 };
  }

  const parsedDueDate = typeof dueDate === "string" ? new Date(dueDate) : null;
  if (parsedDueDate !== null && isNaN(parsedDueDate.getTime())) {
    return { ok: false, error: "Invalid due date.", status: 400 };
  }

  return {
    ok: true,
    data: {
      title: title.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      priority:
        typeof priority === "string" && priority.trim() ? priority.trim() : null,
      dueDate: parsedDueDate,
      projectId,
    },
  };
}

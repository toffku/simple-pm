import type { CreateProjectInput, UpdateProjectInput } from "../types/api.types.js";

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

export function validateCreateProject(
  body: unknown,
): ValidationResult<CreateProjectInput> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body.", status: 400 };
  }

  const { name, description, startDate, endDate } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return { ok: false, error: "Project name is required.", status: 400 };
  }

  const parsedStartDate = typeof startDate === "string" ? new Date(startDate) : null;
  const parsedEndDate = typeof endDate === "string" ? new Date(endDate) : null;

  if (parsedStartDate !== null && isNaN(parsedStartDate.getTime())) {
    return { ok: false, error: "Invalid start date.", status: 400 };
  }
  if (parsedEndDate !== null && isNaN(parsedEndDate.getTime())) {
    return { ok: false, error: "Invalid end date.", status: 400 };
  }

  return {
    ok: true,
    data: {
      name: name.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    },
  };
}

const VALID_STATUSES = new Set(["active", "completed"]);

export function validateUpdateProject(
  body: unknown,
): ValidationResult<UpdateProjectInput> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body.", status: 400 };
  }

  const { status } = body as Record<string, unknown>;

  if (typeof status !== "string" || !VALID_STATUSES.has(status)) {
    return { ok: false, error: "Status must be 'active' or 'completed'.", status: 400 };
  }

  return { ok: true, data: { status } };
}

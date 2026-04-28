import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { DatePicker } from "./DatePicker";
import { postJson } from "@/lib/api";
import { ApiTask } from "@/types";
import { cn } from "@/lib/utils";

const TITLE_MAX = 150;
const DESCRIPTION_MAX = 1000;

const PRIORITY_OPTIONS = ["Low", "Normal", "High", "Urgent"] as const;
type Priority = (typeof PRIORITY_OPTIONS)[number];

type Props = {
  projectId: number;
  onClose: () => void;
  onTaskCreated: () => void;
};

const AddTaskCard = ({ projectId, onClose, onTaskCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [priority, setPriority] = useState<Priority>("Normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateFields = (): boolean => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Task title is required.");
      return false;
    }
    if (trimmedTitle.length > TITLE_MAX) {
      setTitleError(`Task title must be ${TITLE_MAX} characters or fewer.`);
      return false;
    }
    setTitleError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      setIsSubmitting(true);
      setApiError(null);
      await postJson<ApiTask>("/api/tasks", {
        title: title.trim(),
        description: description.trim() || null,
        dueDate: dueDate?.toISOString() ?? null,
        priority,
        projectId,
      });
      onTaskCreated();
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md mx-4 p-6 gap-0"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Add a new task</h2>
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(null);
              }}
              disabled={isSubmitting}
              maxLength={TITLE_MAX + 1}
              autoFocus
            />
            {titleError && (
              <p className="text-sm text-destructive">{titleError}</p>
            )}
          </div>

          <Input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            maxLength={DESCRIPTION_MAX}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              disabled={isSubmitting}
              className={cn(
                "border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Due date</label>
            <DatePicker value={dueDate} onChange={setDueDate} />
          </div>

          {apiError && (
            <p className="text-sm text-destructive">{apiError}</p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Adding..." : "Add task"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddTaskCard;

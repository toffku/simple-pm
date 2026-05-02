import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { DatePicker } from "./DatePicker";
import { postJson } from "@/lib/api";
import { ApiProject } from "@/types";

const NAME_MAX = 100;
const DESCRIPTION_MAX = 500;

type Props = {
  onClose: () => void;
  onProjectCreated: () => void;
};

const AddProjectCard = ({ onClose, onProjectCreated }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateFields = (): boolean => {
    let valid = true;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Project name is required.");
      valid = false;
    } else if (trimmedName.length > NAME_MAX) {
      setNameError(`Project name must be ${NAME_MAX} characters or fewer.`);
      valid = false;
    } else {
      setNameError(null);
    }

    if (startDate && endDate && endDate <= startDate) {
      setDateError("End date must be after the start date.");
      valid = false;
    } else {
      setDateError(null);
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      setIsSubmitting(true);
      setApiError(null);
      await postJson<ApiProject>("/api/projects", {
        name: name.trim(),
        description: description.trim() || null,
        startDate: startDate?.toISOString() ?? null,
        endDate: endDate?.toISOString() ?? null,
      });
      onProjectCreated();
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to create project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md p-6 flex flex-col gap-4 max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-xl font-semibold">Add a new project</h1>
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              disabled={isSubmitting}
              maxLength={NAME_MAX + 1}
            />
            {nameError && (
              <p className="text-sm text-destructive">{nameError}</p>
            )}
          </div>

          <Input
            type="text"
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            maxLength={DESCRIPTION_MAX}
          />

          <label className="text-sm font-medium">Project start date</label>
          <DatePicker value={startDate} onChange={(d) => {
            setStartDate(d);
            if (dateError) setDateError(null);
          }} />

          <label className="text-sm font-medium">Project end date</label>
          <DatePicker value={endDate} onChange={(d) => {
            setEndDate(d);
            if (dateError) setDateError(null);
          }} />

          {dateError && (
            <p className="text-sm text-destructive">{dateError}</p>
          )}

          {apiError && (
            <p className="text-sm text-destructive">{apiError}</p>
          )}

          <div className="flex gap-2 justify-end">
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
              {isSubmitting ? "Adding..." : "Add project"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProjectCard;

import { TaskProps } from "@/types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface TaskCardProps {
  task: TaskProps;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const priorityLabel = task.priority || "Normal";

  return (
    <Card className="mb-4 p-4 cursor-pointer transition duration-150 ease-in-out hover:bg-muted">
      <div>
        <Badge variant="normal">{priorityLabel}</Badge>
        <h1 className="font-bold pt-2">{task.title}</h1>
      </div>
      <div>
        <p className="opacity-65 text-xs">
          {task.date ? new Date(task.date).toLocaleDateString() : "No due date"}
        </p>
        <p className="text-xs opacity-70 pb-1">{task.status}</p>
        <p>{task.description}</p>
      </div>
    </Card>
  );
};

export default TaskCard;

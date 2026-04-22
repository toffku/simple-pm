import { ProjectProps } from "@/types";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Link } from "@tanstack/react-router";

interface ProjectCardProps {
  project: ProjectProps;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const total = Math.max(1, project.tasks.length);
  const completedPct = Math.round((project.completedCount / total) * 100);
  const inProgressPct = Math.round((project.inProgressCount / total) * 100);

  return (
    <Link to="/task/$projectId" params={{ projectId: String(project.id) }}>
      <Card className="mb-4 p-4 cursor-pointer transition duration-150 ease-in-out hover:bg-muted flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full min-w-0 flex flex-col justify-between">
        <h1 className="font-bold text-xl">{project.title}</h1>
        <div className="text-xs flex flex-wrap gap-2 py-4 sm:py-5">
          <Badge
            variant="outline"
            className="border-green-600 text-green-600 px-2"
          >
            <span className="rounded-full w-2 h-2 bg-green-500 opacity-50"></span>
            {project.completedCount} Completed
          </Badge>
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-500 px-2"
          >
            <span className="rounded-full w-2 h-2 bg-orange-500 opacity-50"></span>
            {project.inProgressCount} In Progress
          </Badge>
          <Badge
            variant="outline"
            className="border-gray-200/50 text-gray-200/50 px-2"
          >
            <span className="rounded-full w-2 h-2 bg-gray-200 opacity-50"></span>
            {project.todoCount} Not Complete
          </Badge>
        </div>
        <span className="w-full">
          <Progress
            segments={[
              { value: completedPct, color: "bg-green-500" },
              { value: inProgressPct, color: "bg-orange-500" },
            ]}
          />
        </span>
      </div>
      <div className="shrink-0 sm:w-[60px] flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
        <span className="flex items-end justify-center gap-2">
          <p className="font-bold text-4xl -mb-1">{project.daysLeft}</p>
          <p className="opacity-65 text-xs">days left</p>
        </span>
      </div>
    </Card>
  </Link>
);
};

export default ProjectCard;

import { ProjectProps } from "@/types";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface ProjectCardProps {
  project: ProjectProps;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="mb-4 p-4 cursor-pointer transition duration-150 ease-in-out hover:bg-muted flex-row items-center justify-between">
      <div className="w-full h-full flex flex-col justify-between">
        <h1 className="font-bold text-xl">{project.title}</h1>
        <div className="text-xs flex py-5">
          <Badge
            variant="outline"
            className="border-green-600 text-green-600 px-2 mr-2"
          >
            <span className="rounded-full w-2 h-2 bg-green-500 opacity-50"></span>
            5 Completed
          </Badge>
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-500 px-2 mr-2"
          >
            <span className="rounded-full w-2 h-2 bg-orange-500 opacity-50"></span>
            7 In Progress
          </Badge>
          <Badge
            variant="outline"
            className="border-gray-200/50 text-gray-200/50 px-2 mr-2"
          >
            <span className="rounded-full w-2 h-2 bg-gray-200 opacity-50"></span>
            3 Not Complete
          </Badge>
        </div>
        <span className="w-full">
          <Progress
            segments={[
              { value: 10, color: "bg-green-500" },
              { value: 35, color: "bg-orange-500" },
            ]}
          />
        </span>
      </div>
      <div className="w-[60px]">
        <p className="font-bold text-3xl">{project.daysLeft}</p>
        <p className="opacity-65 text-xs">days left</p>
      </div>
    </Card>
  );
};

export default ProjectCard;

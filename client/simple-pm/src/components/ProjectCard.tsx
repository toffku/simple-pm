import { ProjectProps } from "@/types";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface ProjectCardProps {
  project: ProjectProps;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="mb-4 p-4 cursor-pointer transition duration-150 ease-in-out hover:bg-muted flex-row items-center justify-between">
      <div className="w-full h-full flex flex-col justify-between">
        <h1 className="font-bold">{project.title}</h1>
        <span className="w-full">
          <Progress value={33} />
        </span>
      </div>
      <div className="w-[60px]">
        <p className="font-bold text-2xl">{project.daysLeft}</p>
        <p className="opacity-65 text-xs">days left</p>
      </div>
    </Card>
  );
};

export default ProjectCard;

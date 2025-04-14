import { ProjectProps } from "@/types";
import ProjectCard from "./ProjectCard";
import { ArrowDownUp, Plus } from "lucide-react";
import { Button } from "./ui/button";

const projects: ProjectProps[] = [
  {
    title: "Project 1",
    daysLeft: 23,
    tasks: [],
  },
  {
    title: "Project 2",
    daysLeft: 76,
    tasks: [],
  },
  {
    title: "Project 3",
    daysLeft: 9,
    tasks: [],
  },
];

const ProjectDashboard = () => {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold p-8">Projects</h1>
      </div>
      <div className="px-8 w-full flex justify-between items-center">
        <Button
          variant="secondary"
          className="flex items-center bg-transparent cursor-pointer px-2"
        >
          <ArrowDownUp width={18} />
          <p className="font-semibold opacity-95 text-sm">Sort</p>
        </Button>
        <Button
          variant="secondary"
          className="flex items-center cursor-pointer px-2"
        >
          <Plus width={18} />
          <p className="font-semibold opacity-95 pb-0.5 text-sm">
            Add a new project
          </p>
        </Button>
      </div>
      <div className="p-8 grid grid-cols-2 gap-4">
        {projects.map((project: ProjectProps) => (
          <ProjectCard project={project} />
        ))}
      </div>
    </>
  );
};

export default ProjectDashboard;

import { TaskProps } from "@/types";
import TaskCard from "./TaskCard";

const tasks: TaskProps[] = [
  {
    title: "Task 1",
    date: "2023-10-01",
    description: "Description of Task 1",
  },
  {
    title: "Task 2",
    date: "2023-10-02",
    description: "Description of Task 2",
  },
  {
    title: "Task 3",
    date: "2023-10-03",
    description: "Description of Task 3",
  },
];

const Dashboard = () => {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold p-8">Project title</h1>
      </div>
      <div className="mx-8 p-4 rounded-md border-l-8 bg-card border-l-pink-700">
        <h1 className="font-bold">To Do</h1>
      </div>
      <div className="p-8">
        {tasks.map((task: TaskProps) => (
          <TaskCard task={task} />
        ))}
      </div>
      <div className="mx-8 p-4 rounded-md bg-card border-l-8 border-l-indigo-700">
        <h1 className="font-bold">In Progress</h1>
      </div>
      <div className="p-8">
        {tasks.map((task: TaskProps) => (
          <TaskCard task={task} />
        ))}
      </div>
      <div className="mx-8 p-4 rounded-md bg-card border-l-8 border-l-green-700">
        <h1 className="font-bold">Completed</h1>
      </div>
      <div className="p-8">
        {tasks.map((task: TaskProps) => (
          <TaskCard task={task} />
        ))}
      </div>
    </>
  );
};

export default Dashboard;

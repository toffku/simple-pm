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
      <div className="mx-8 px-4 py-2 rounded-md border-l-8 border-l-pink-700">
        <h1 className="font-bold">To Do</h1>
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

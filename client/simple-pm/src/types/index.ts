export type TaskProps = {
  title: string;
  date: string;
  description: string;
};

export type ProjectProps = {
  title: string;
  daysLeft: number;
  tasks: TaskProps[];
};

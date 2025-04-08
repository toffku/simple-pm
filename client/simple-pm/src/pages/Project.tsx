import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import TasksDashboard from "@/components/TasksDashboard";
import { SidebarProvider } from "@/components/ui/sidebar";

const Project = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex flex-col">
        <Navbar />
        <TasksDashboard />
      </main>
    </SidebarProvider>
  );
};

export default Project;

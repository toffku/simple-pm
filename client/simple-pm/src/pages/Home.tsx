import AppSidebar from "@/components/AppSidebar";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Home = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex flex-col">
        <Navbar />
        <Dashboard />
      </main>
    </SidebarProvider>
  );
};

export default Home;

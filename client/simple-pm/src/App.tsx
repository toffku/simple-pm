import AppSidebar from "./components/AppSidebar";
import { ModeToggle } from "./components/ModeToggle";
import { ThemeProvider } from "./components/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            <ModeToggle />
            <Dashboard />
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}

export default App;

import { Link } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Briefcase, Calendar, Grid2X2, LucideProps } from "lucide-react";

interface SidebarTypes {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

interface ProjectTypes {
  title: string;
  projectId: string;
}

const items: Array<SidebarTypes> = [
  {
    title: "Board",
    url: "/",
    icon: Grid2X2,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
];

const projects: Array<ProjectTypes> = [
  { title: "proj-01", projectId: "proj-01" },
  { title: "proj-02", projectId: "proj-02" },
  { title: "proj-03", projectId: "proj-03" },
];

const AppSidebar = () => {
  return (
    <>
      <Sidebar>
        <h1 className="text-lg font-bold p-5">simple֊pm</h1>

        {/* <SidebarContent /> */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.url === "#" ? (
                      <a href="#">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <Link
                        to={item.url}
                        activeOptions={{ exact: true }}
                        activeProps={{
                          className:
                            "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                        }}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/task/$projectId"
                      params={{ projectId: item.projectId }}
                      activeOptions={{ exact: true }}
                      activeProps={{
                        className:
                          "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                      }}
                    >
                      <Briefcase />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>
    </>
  );
};

export default AppSidebar;

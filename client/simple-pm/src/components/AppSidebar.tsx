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
  url: string;
}

const items: Array<SidebarTypes> = [
  {
    title: "Board",
    url: "#",
    icon: Grid2X2,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
];

const projects: Array<ProjectTypes> = [
  {
    title: "proj-01",
    url: "#",
  },
  {
    title: "proj-02",
    url: "#",
  },
  {
    title: "proj-03",
    url: "#",
  },
];

const AppSidebar = () => {
  return (
    <>
      <Sidebar>
        <h1 className="text-lg font-bold p-5">simple.pm</h1>

        {/* <SidebarContent /> */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
                    <a href={item.url}>
                      <Briefcase />
                      <span>{item.title}</span>
                    </a>
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

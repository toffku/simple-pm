import { ModeToggle } from "./ModeToggle";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  return (
    <>
      <nav className="w-full flex justify-between p-2">
        <div className="flex flex-row">
          <SidebarTrigger />
        </div>
        <ModeToggle />
      </nav>
    </>
  );
};

export default Navbar;

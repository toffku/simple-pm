import { ArrowDownUp } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type SortOption = "newest" | "oldest" | "alpha-asc" | "alpha-desc";

export const SORT_LABELS: Record<SortOption, string> = {
  newest: "Latest",
  oldest: "Oldest",
  "alpha-asc": "Alphabetical (A–Z)",
  "alpha-desc": "Alphabetical (Z–A)",
};

interface ProjectSortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function ProjectSortDropdown({
  value,
  onChange,
}: ProjectSortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="flex items-center bg-transparent cursor-pointer px-2 w-full sm:w-auto justify-center sm:justify-start"
        >
          <ArrowDownUp width={18} />
          <span className="font-semibold opacity-95 text-sm">Sort</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Sort Projects</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange(v as SortOption)}
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {SORT_LABELS[option]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

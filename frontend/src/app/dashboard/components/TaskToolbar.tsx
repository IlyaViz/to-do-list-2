import { Search, Filter, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface TaskToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: "all" | "done" | "undone";
  onFilterChange: (status: "all" | "done" | "undone") => void;
  sortOrder: "none" | "desc" | "asc";
  onSortCycle: () => void;
}

export function TaskToolbar({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortOrder,
  onSortCycle,
}: TaskToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="w-27.5 justify-between capitalize"
              ></Button>
            }
          >
            <span className="flex items-center gap-2">
              <Filter className="size-4" />
              {filterStatus}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onFilterChange("all")}>
              All Tasks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("done")}>
              Done
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("undone")}>
              Undone
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          onClick={onSortCycle}
          className="w-27.5 justify-between"
        >
          Priority
          {sortOrder === "none" ? (
            <ArrowUpDown className="size-4 text-muted-foreground" />
          ) : sortOrder === "desc" ? (
            <ArrowDown className="size-4" />
          ) : (
            <ArrowUp className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

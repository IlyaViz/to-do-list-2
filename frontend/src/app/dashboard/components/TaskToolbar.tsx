import {
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface TaskToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: "all" | "done" | "undone";
  onFilterChange: (status: "all" | "done" | "undone") => void;
  sortOrder: "none" | "desc" | "asc";
  onSortCycle: () => void;
  categories: string[];
  filterCategory: string;
  onFilterCategoryChange: (category: string) => void;
}

export function TaskToolbar({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortOrder,
  onSortCycle,
  categories,
  filterCategory,
  onFilterCategoryChange,
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

      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="w-28 justify-between capitalize"
              ></Button>
            }
          >
            <span className="flex items-center gap-2">
              <Filter className="size-4 shrink-0" />
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

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="w-36 justify-between"
              ></Button>
            }
          >
            <span className="flex items-center gap-2 truncate">
              <Tag className="size-4 shrink-0" />
              <span className="truncate">
                {filterCategory === "all" ? "All Categories" : filterCategory}
              </span>
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="max-h-64 overflow-y-auto w-40"
          >
            <DropdownMenuItem onClick={() => onFilterCategoryChange("all")}>
              All Categories
            </DropdownMenuItem>
            {categories.length > 0 && <DropdownMenuSeparator />}

            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat}
                onClick={() => onFilterCategoryChange(cat)}
              >
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          onClick={onSortCycle}
          className="w-28 justify-between shrink-0"
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

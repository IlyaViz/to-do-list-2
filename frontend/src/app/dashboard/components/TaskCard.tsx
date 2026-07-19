import {
  Calendar,
  Flag,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn, formatToDisplayDate, getPriorityColorClass } from "@/lib/utils";
import type { TaskRead } from "@/schemas/taskSchema";

interface TaskCardProps {
  task: TaskRead;
  isSubtask?: boolean;
  onToggleDone: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: TaskRead) => void;
  onAddSubtask?: (parentId: string) => void;
}

export function TaskCard({
  task,
  isSubtask,
  onToggleDone,
  onDelete,
  onEdit,
  onAddSubtask,
}: TaskCardProps) {
  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !task.is_done;

  const formattedDate = task.due_date
    ? formatToDisplayDate(task.due_date)
    : null;

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-sm",
        task.is_done && "opacity-60 bg-muted/30",
        isSubtask && "ml-8 rounded-l-none border-l-4 border-l-primary/40",
      )}
    >
      <div className="pt-0.5 shrink-0">
        <Checkbox
          checked={task.is_done}
          onCheckedChange={() => onToggleDone(task.id, task.is_done)}
          aria-label="Mark task as done"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "text-sm font-medium leading-snug break-all",
              task.is_done && "line-through text-muted-foreground",
            )}
          >
            {task.title}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="-mr-1.5 -mt-1.5 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100 shrink-0"
                />
              }
            >
              <MoreVertical className="size-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {!isSubtask && onAddSubtask && (
                <DropdownMenuItem onClick={() => onAddSubtask(task.id)}>
                  <Plus className="mr-2 size-4" />
                  Add Subtask
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {task.category && (
            <Badge
              variant="secondary"
              className="px-1.5 py-0 text-[10px] font-medium truncate max-w-full"
            >
              {task.category}
            </Badge>
          )}

          <div
            className="flex items-center gap-1 shrink-0"
            title={`Priority: ${task.priority}/10`}
          >
            <Flag
              className={cn("size-3", getPriorityColorClass(task.priority))}
            />
            <span>P{task.priority}</span>
          </div>

          {formattedDate && (
            <div
              className={cn(
                "flex items-center gap-1 shrink-0",
                isOverdue && "font-medium text-destructive",
              )}
            >
              <Calendar className="size-3" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

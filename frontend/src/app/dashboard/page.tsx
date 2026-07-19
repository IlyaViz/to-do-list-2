"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { useTasks } from "@/hooks/useTasks";
import type { TaskCreateData, TaskRead } from "@/schemas/taskSchema";
import { TaskCard } from "@/app/dashboard/components/TaskCard";
import { TaskForm } from "@/app/dashboard/components/TaskForm";
import { TaskToolbar } from "@/app/dashboard/components/TaskToolbar";

export default function DashboardPage() {
  const router = useRouter();
  const { taskQuery, createTask, updateTask, deleteTask } = useTasks();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRead | null>(null);
  const [parentForNewTask, setParentForNewTask] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "done" | "undone">(
    "all",
  );
  const [sortOrder, setSortOrder] = useState<"none" | "desc" | "asc">("none");

  const { parents, children, orphanedChildren } = useMemo(() => {
    let result = [...(taskQuery.data || [])];

    if (filterStatus === "done") {
      result = result.filter((t) => t.is_done);
    } else if (filterStatus === "undone") {
      result = result.filter((t) => !t.is_done);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchedTasks = result.filter((t) =>
        t.title.toLowerCase().includes(query),
      );

      const matchedParentIds = new Set(
        matchedTasks.map((t) => t.parent_id).filter(Boolean),
      );

      result = result.filter(
        (t) => matchedTasks.includes(t) || matchedParentIds.has(t.id),
      );
    }

    if (sortOrder === "asc") {
      result.sort((a, b) => a.priority - b.priority);
    } else if (sortOrder === "desc") {
      result.sort((a, b) => b.priority - a.priority);
    }

    const parentsList = result.filter((t) => !t.parent_id);
    const childrenList = result.filter((t) => t.parent_id);

    const parentIds = new Set(parentsList.map((p) => p.id));
    const orphansList = childrenList.filter(
      (c) => !parentIds.has(c.parent_id as string),
    );

    return {
      parents: parentsList,
      children: childrenList,
      orphanedChildren: orphansList,
    };
  }, [taskQuery.data, filterStatus, searchQuery, sortOrder]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleDone = (id: string, currentStatus: boolean) => {
    updateTask.mutate({ id, data: { is_done: !currentStatus } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(id);
    }
  };

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setParentForNewTask(null);
    setIsFormOpen(true);
  };

  const handleAddSubtask = (parentId: string) => {
    setEditingTask(null);
    setParentForNewTask(parentId);
    setIsFormOpen(true);
  };

  const handleEdit = (task: TaskRead) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: TaskCreateData) => {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, data },
        { onSuccess: () => setIsFormOpen(false) },
      );
    } else {
      createTask.mutate(data, { onSuccess: () => setIsFormOpen(false) });
    }
  };

  const cycleSortOrder = () => {
    setSortOrder((prev) =>
      prev === "none" ? "desc" : prev === "desc" ? "asc" : "none",
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-xl bg-card p-4 shadow-sm ring-1 ring-foreground/10 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Manage your daily goals and subtasks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>

            <Button onClick={handleOpenNewTask}>
              <Plus className="mr-2 size-4" />
              New Task
            </Button>
          </div>
        </header>

        <main className="flex min-h-[400px] flex-col gap-4 rounded-xl bg-card p-4 shadow-sm ring-1 ring-foreground/10">
          <TaskToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            sortOrder={sortOrder}
            onSortCycle={cycleSortOrder}
          />

          <div className="h-px bg-border" />

          {taskQuery.isLoading ? (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              Loading tasks...
            </div>
          ) : parents.length === 0 && children.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-3">
              <p className="text-muted-foreground">No tasks found.</p>
              {!searchQuery && filterStatus === "all" && (
                <Button variant="outline" size="sm" onClick={handleOpenNewTask}>
                  Create your first task
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {parents.map((parent) => (
                <React.Fragment key={parent.id}>
                  <TaskCard
                    task={parent}
                    onToggleDone={handleToggleDone}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onAddSubtask={handleAddSubtask}
                  />

                  {children
                    .filter((c) => c.parent_id === parent.id)
                    .map((child) => (
                      <TaskCard
                        key={child.id}
                        task={child}
                        isSubtask
                        onToggleDone={handleToggleDone}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                </React.Fragment>
              ))}

              {orphanedChildren.map((child) => (
                <TaskCard
                  key={child.id}
                  task={child}
                  isSubtask
                  onToggleDone={handleToggleDone}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingTask}
        parentId={parentForNewTask}
        onSubmit={handleFormSubmit}
        isPending={createTask.isPending || updateTask.isPending}
      />
    </div>
  );
}

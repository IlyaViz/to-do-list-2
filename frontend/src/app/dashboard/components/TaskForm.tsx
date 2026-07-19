"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/Field";
import { formatToLocalDateTimeInput } from "@/lib/utils";
import {
  taskCreateSchema,
  type TaskCreateData,
  type TaskRead,
} from "@/schemas/taskSchema";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: TaskRead | null;
  parentId?: string | null;
  onSubmit: (data: TaskCreateData) => void;
  isPending: boolean;
}

export function TaskForm({
  open,
  onOpenChange,
  initialData,
  parentId,
  onSubmit,
  isPending,
}: TaskFormProps) {
  const form = useForm<TaskCreateData>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      title: "",
      priority: 5,
      category: "",
      due_date: "",
      parent_id: null,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          title: initialData.title,
          priority: initialData.priority,
          category: initialData.category || "",
          due_date: initialData.due_date
            ? formatToLocalDateTimeInput(initialData.due_date)
            : "",
          parent_id: initialData.parent_id,
        });
      } else {
        form.reset({
          title: "",
          priority: 5,
          category: "",
          due_date: "",
          parent_id: parentId || null,
        });
      }
    }
  }, [open, initialData, parentId, form]);

  const handleSubmit = (values: TaskCreateData) => {
    const cleanedData: TaskCreateData = {
      ...values,
      category: values.category?.trim() || null,
      due_date: values.due_date
        ? new Date(values.due_date).toISOString()
        : null,
      parent_id: values.parent_id || null,
    };

    onSubmit(cleanedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup className="py-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="task-title">Title</FieldLabel>

                  <Input
                    {...field}
                    id="task-title"
                    placeholder="What needs to be done?"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="priority"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="task-priority">
                    Priority (1-10)
                  </FieldLabel>

                  <Input
                    {...field}
                    id="task-priority"
                    type="number"
                    min={1}
                    max={10}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="task-category">
                    Category (Optional)
                  </FieldLabel>

                  <Input
                    {...field}
                    value={field.value || ""}
                    id="task-category"
                    placeholder="e.g. Work, Home"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="due_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="task-due-date">
                    Due Date (Optional)
                  </FieldLabel>

                  <Input
                    {...field}
                    value={field.value || ""}
                    id="task-due-date"
                    type="datetime-local"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

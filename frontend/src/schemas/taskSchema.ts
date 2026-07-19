import { z } from "zod";

export const taskCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(50, "Title must be less than 50 characters"),
  priority: z
    .number()
    .int()
    .min(1, "Priority must be at least 1")
    .max(10, "Priority must be at most 10"),
  category: z
    .string()
    .trim()
    .max(50, "Category must be less than 50 characters")
    .nullable()
    .optional(),
  due_date: z.string().nullable().optional(),
  parent_id: z.uuid().nullable().optional(),
});

export const taskUpdateSchema = taskCreateSchema.partial().extend({
  is_done: z.boolean().optional(),
});

export type TaskCreateData = z.infer<typeof taskCreateSchema>;
export type TaskUpdateData = z.infer<typeof taskUpdateSchema>;

export interface TaskRead {
  id: string;
  user_id: string;
  title: string;
  is_done: boolean;
  priority: number;
  category: string | null;
  due_date: string | null;
  parent_id: string | null;
}

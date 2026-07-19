import { apiClient } from "@/lib/apiClient";
import type {
  TaskCreateData,
  TaskRead,
  TaskUpdateData,
} from "@/schemas/taskSchema";

export const taskService = {
  async getTasks(): Promise<TaskRead[]> {
    const response = await apiClient.get<TaskRead[]>("/tasks");

    return response.data;
  },

  async createTask(data: TaskCreateData): Promise<TaskRead> {
    const response = await apiClient.post<TaskRead>("/tasks", data);

    return response.data;
  },

  async updateTask({
    id,
    data,
  }: {
    id: string;
    data: TaskUpdateData;
  }): Promise<TaskRead> {
    const response = await apiClient.patch<TaskRead>(`/tasks/${id}`, data);

    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};

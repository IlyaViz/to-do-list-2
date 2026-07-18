import { apiClient, setAccessToken } from "@/lib/apiClient";
import type { LoginFormData, RegisterFormData } from "@/schemas/authSchema";

export const authService = {
  async login(data: LoginFormData) {
    const response = await apiClient.post("/auth/login", data);

    setAccessToken(response.data.access_token);

    return response.data;
  },

  async register(data: RegisterFormData) {
    const response = await apiClient.post("/auth/register", data);

    setAccessToken(response.data.access_token);

    return response.data;
  },

  async logout() {
    await apiClient.post("/auth/logout");

    setAccessToken(null);
  },
};

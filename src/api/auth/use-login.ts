import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface LoginPayload {
  login: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const response = await axios.post("/auth/login", data);
      return response.data;
    },
  });
}

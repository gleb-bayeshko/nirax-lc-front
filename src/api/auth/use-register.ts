import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface RegisterPayload {
  companyName: string;
  fullName: string;
  phone: string;
  email: string;
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await axios.post("/applications/create", data);
      return response.data;
    },
  });
}

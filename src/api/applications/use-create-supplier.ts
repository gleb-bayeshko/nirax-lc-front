import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface CreateSupplierDto {
  site: string;
  siteRU: string;
  description: string;
}

export function useCreateSupplier() {
  return useMutation({
    mutationFn: async (data: CreateSupplierDto) => {
      const response = await axios.post("/supplier-en", data);
      return response.data;
    },
  });
}

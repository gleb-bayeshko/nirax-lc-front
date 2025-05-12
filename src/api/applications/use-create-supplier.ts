import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface CreateSupplierDto {
  site: string;
  description: string;
  applicationId: number;
}

export function useCreateSupplier() {
  return useMutation({
    mutationFn: async (data: CreateSupplierDto) => {
      const response = await axios.post("/supplier-new", {
        ...data,
        website: data.site,
      });
      return response.data;
    },
  });
}

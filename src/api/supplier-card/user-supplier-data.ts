import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useSupplierData(id: number) {
  return useQuery({
    queryKey: ["supplierData", id],
    queryFn: async () => {
      const response = await axios.get(`/supplier-cards/${id}`);
      return response.data.result;
    },
  });
}

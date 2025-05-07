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

export function useSupplierDataImages(id: number) {
  return useQuery({
    queryKey: ["supplierDataImages", id],
    queryFn: async () => {
      const response = await axios.get(`/supplier-cards/${id}/image`);
      return response.data.result;
    },
  });
}

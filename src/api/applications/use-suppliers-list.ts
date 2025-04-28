import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Supplier {
  idSupplier: number;
  site: string;
  siteRU?: string;
}

export function useSuppliersList() {
  return useQuery<Supplier[]>({
    queryKey: ["suppliersList"],
    queryFn: async () => {
      const response = await axios.get("https://web.nirax.ru/api/v1/suppliers/list/all");
      return response.data;
    },
  });
}
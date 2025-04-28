import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface UpdateSupplierPayload {
  id: number;
  companyName: string;
  website?: string;
  description?: string;
  phone?: string;
  assortment?: string;
  storageArea?: string;
  ownBrand?: string;
  regions?: string;
  priceListToEmail?: number;
  workByApi?: number;
  serverSpeed?: number;
  apiDocUrl?: string;
  apiSearch?: number;
  apiOrder?: number;
  apiTracking?: number;
  fullName?: string;
  contactPhone?: string;
  contactEmail?: string;
  photos?: string[];
}

export function useUpdateSupplierData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSupplierPayload) => {
      const response = await axios.patch(`/supplier-cards/${data.id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["supplierData", variables.id],
      });
    },
  });
}

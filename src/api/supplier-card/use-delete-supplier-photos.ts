import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useDeleteSupplierPhotos(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoUrls: string[]) => {
      const response = await axios.delete(`/supplier-cards/${id}/image`, {
        data: { photos: photoUrls },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supplierDataImages", id],
      });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useUploadSupplierPhotos(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photos: File[]) => {
      const formData = new FormData();
      photos.forEach((file) => {
        formData.append("photos", file);
      });

      const response = await axios.put(
        `/supplier-cards/${id}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supplierData", id],
      });
    },
  });
}

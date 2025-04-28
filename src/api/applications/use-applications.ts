import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

export interface Application {
  id: number;
  companyName: string;
  fullName: string;
  phone: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
  actualSupplierId: number | null;
  createdAt: string;
  login: string;
  password: string;
}

interface ApplicationsResponse {
  applications: Application[];
  total: number;
}

interface RejectMutateApplication {
  id: number;
  page: number;
  limit: number;
}

interface AcceptMutateApplication {
  id: number;
  supplierId: number;
  page: number;
  limit: number;
}

const applicationsRequest = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const offset = (page - 1) * limit;

  const response = await axios.get("/applications", {
    params: { offset, limit },
  });

  return response?.data?.result;
};

export function useApplications(page: number, limit = 10) {
  return useQuery<ApplicationsResponse>({
    queryKey: ["adminApplications", page, limit],
    queryFn: () => applicationsRequest({ page, limit }),
    retry: false,
    refetchInterval: 30000,
  });
}

export function useConfirmApplication() {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, AcceptMutateApplication>({
    mutationFn: async ({
      id,
      supplierId,
    }: {
      id: number;
      supplierId: number;
    }) => {
      const response = await axios.patch(
        `/applications/confirm-existing/${id}`,
        {
          actualSupplierId: supplierId,
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["adminApplications", variables.page, variables.limit],
      });
    },
  });
}

export function useRejectApplication() {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, RejectMutateApplication>({
    mutationFn: async (data: RejectMutateApplication) => {
      const response = await axios.patch(`/applications/reject/${data.id}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["adminApplications", variables.page, variables.limit],
      });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

export interface Order {
  id: string;
  idUser: number;
  ipUser: string;
  date: string;
  productID: number;
  articleID: number;
  article: string;
  brand: string;
  manufacturer: string;
  articleName: string;
  supplierName: string;
  supplierStore: string;
  deliveryDay: number;
  buyerStore: string;
  count: number;
  priceIn: number;
  priceOut: number;
  stockAvailability: number;
  customerDate: string | null;
  customerCount: number | null;
  customerPrice: number | null;
  deliveryDate: string;
  deliveryCount: number;
  supplierDate: string | null;
  supplierCount: number | null;
  supplierPrice: number | null;
  company: string;
  userName: string;
  supplierSite: string;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
}

const ordersRequest = async ({
  id,
  page,
  limit,
  dateFrom,
  dateTo,
  sort = "DESC",
}: {
  id: number;
  page: number;
  limit: number;
  dateFrom: string;
  dateTo: string;
  sort: "ASC" | "DESC";
}) => {
  const offset = (page - 1) * limit;

  const response = await axios.get(`/analytics/${id}/orders`, {
    params: { offset, limit, dateFrom, dateTo, sort },
  });

  return response?.data?.result;
};

export function useOrders(
  id: number,
  page: number,
  limit = 20,
  dateFrom: string,
  dateTo: string,
  sort: "ASC" | "DESC" = "DESC"
) {
  return useQuery<OrdersResponse>({
    queryKey: ["supplierOrders", id, page, limit, dateFrom, dateTo, sort],
    queryFn: () => ordersRequest({ id, page, limit, dateFrom, dateTo, sort }),
    retry: false,
    refetchInterval: 30000,
  });
}

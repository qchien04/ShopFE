import { useQuery } from "@tanstack/react-query";
import { orderApi } from "../../api/order.api";

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: orderApi.getUserOrder,
  });
};

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: orderApi.getAllOrder,
  });
};
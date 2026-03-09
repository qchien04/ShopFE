import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../../api/order.api";
import { OrderStatus } from "../../types/entity.type";
import { antdMessage } from "../../utils/antdMessage";

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


export const useUpdateStatusOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      orderApi.updateStatusOrders(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      antdMessage.success(`Đã cập nhật trạng thái đơn hàng!`);
    },
  });
};


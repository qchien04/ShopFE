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
    mutationFn: ({ id, status,reason, internalNote }: { id: number; status: OrderStatus,reason:string,internalNote:string }) =>
      orderApi.updateStatusOrders(id, status, reason, internalNote),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      antdMessage.success(`Đã cập nhật trạng thái đơn hàng!`);
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      orderApi.updateStatusOrders(id, OrderStatus.CANCELLED, reason, ""),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      antdMessage.success(`Đã hủy đơn hàng thành công!`);
    },
    onError: (error: any) => {
      antdMessage.error(error.response?.data?.message || "Không thể hủy đơn hàng!");
    }
  });
};

export const useOrderDetail = (id: number | null) => {
  return useQuery({
    queryKey: ["order-detail", id],
    queryFn: () => orderApi.getOrderById(id!),
    enabled: !!id,
  });
};


// src/hooks/useCreateRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartQueryKeys } from "./category.query-key";
import { cartApi } from "../../api/cart.api";

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKeys.all,
      });
      
    },
  });
};
